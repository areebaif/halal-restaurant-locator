import * as React from "react";
import { Autocomplete, Button, Group, AutocompleteItem } from "@mantine/core";
import { useQuery } from "react-query";
import * as ReactRouter from "react-router-dom";
import * as ReactRedux from "react-redux";
import { fetchZipSearch } from "../backendFunctions";
//import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import { RootState } from "../redux-store/store";
//import reduxStore from "../redux-store/store"
import { zipcodeChange } from "../redux-store/search-slice";
import { SearchTerms } from "../redux-store/search-slice";

export interface restaurantDocument {
  id: BigInteger;
  name: string;
  state: string;
  city: string;
  country: string;
  zipcode: string;
  longitude: number;
  latitude: number;
  // geolocation: [longitude,latitude]
  geolocation: [number, number];
}

export interface PropertiesProps {
  title: string;
  city: string;
  state_id: string;
  state: string;
  zip: string;
}

export interface cityDocument {
  id: number;
  name: string;
}

export interface stateDocument {
  id: number;
  name: string;
}
export interface ZipDocument {
  city_state: string;
  type: "Feature";
  properties: {
    title: string;
    city: string;
    state_id: string;
    state: string;
    zip: string;
  };
  id: number;
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
}

export const SearchBar: React.FC<{}> = () => {
  // we are using mantine autocomplete component to populate data. This component has typing defined as AutoCompleteItem
  const [stateData, setStateData] = React.useState<AutocompleteItem[]>();
  const [cityData, setCityData] = React.useState<AutocompleteItem[]>();
  const [zipData, setZipData] = React.useState<AutocompleteItem[]>();
  const [restaurantData, setRestaurantData] =
    React.useState<AutocompleteItem[]>();

  // User Input Props
  const [zipcodeUserInput, setZipcodeUserInput] = React.useState("");
  const [errorZipcodeUserInput, setErrorZipcodeUserInput] =
    React.useState(false);
  const [cityUserInput, setCityUserInput] = React.useState("");
  const [errorCityUserInput, setErrorCityUserInput] = React.useState(false);
  const [stateUserInput, setStateUserInput] = React.useState("");
  const [errorStateUserInput, setErrorStateUserInput] = React.useState(false);
  const [restaurantNameUserInput, setRestaurantNameUserInput] =
    React.useState("");

  // React Router functions
  const location = ReactRouter.useLocation();
  const path = location.pathname;
  const navigate = ReactRouter.useNavigate();

  // ReduxToolkit functions
  const dispatch = ReactRedux.useDispatch();
  const globalZipcodeValue = ReactRedux.useSelector(
    (state: RootState) => state.search
  );

  // onChange functions
  const onRestaurantNameUserInputChange = (value: string) => {
    console.log("restaurantVqaluex", value);
    setRestaurantNameUserInput(value);
  };

  const onStateUserInputChange = (value: string) => {
    // Check for special characters including numbers
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);

    if (!specialCharsTest) {
      setErrorStateUserInput(false);
      setStateUserInput(value);
    } else {
      setErrorStateUserInput(true);
      setStateUserInput(value);
    }
  };

  const onCityUserInputChange = (value: string) => {
    // Check for special characters including numbers (dont check for white spaces some cities are two words with whote space in between)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);
    if (!specialCharsTest) {
      setErrorCityUserInput(false);
      setCityUserInput(value);
    } else {
      setErrorCityUserInput(true);
      setCityUserInput(value);
    }
  };

  const onZipcodeUserInputChange = (value: string) => {
    // check for white spaces in zipcode
    console.log(value);
    const specialChars = /[ ]/;
    const expression = true;
    switch (expression) {
      case specialChars.test(value):
        setErrorZipcodeUserInput(true);
        setZipcodeUserInput(value);
        break;
      case isNaN(Number(value)):
        setErrorZipcodeUserInput(true);
        setZipcodeUserInput(value);
        break;
      default:
        setErrorZipcodeUserInput(false);
        setZipcodeUserInput(value);
    }
  };

  //   const onBackendSearchTermChange = (data: { [key: string]: any }) => {
  //     // If you are doing updates in a row on object properties, then you need previous state function
  //     setBackendSearchTerms((previousState) => {
  //       return { ...previousState, ...data };
  //     });
  //   };

  // put sanitozation in a separate function
  const sanitizeUserInput = () => {
    let trimmedZipCode = zipcodeUserInput?.trim();
    let trimmedCity = cityUserInput?.trim();
    let trimmedState = stateUserInput?.trim();
    let trimmedRestaurantNameUserInput = restaurantNameUserInput?.trim();

    // validCity
    if (trimmedCity.length) {
      const cityArray = trimmedCity?.split(" ");
      const cityUpperCase = cityArray?.map(
        (item) => item[0].toUpperCase() + item.substring(1)
      );
      trimmedCity = cityUpperCase?.join(" ");
      const validCity = cityData?.filter((item) => item.name === trimmedCity);
      if (!validCity?.length) {
        //TODO: error handling
        console.log("error: you have entered an incorrect city value");
      }
      onCityUserInputChange(trimmedCity);
    }
    // validState
    if (trimmedState.length) {
      const stateArray = trimmedState?.split(" ");
      const stateUpperCase = stateArray?.map(
        (item) => item[0].toUpperCase() + item.substring(1)
      );
      trimmedState = stateUpperCase?.join(" ");
      const validState = stateData?.filter(
        (item) => item.name === trimmedState
      );

      if (!validState?.length) {
        //TODO: error handling
        console.log("error: you have entered an incorrect state value");
      }
      onStateUserInputChange(trimmedState);
    }
    // valid restaurantName
    if (trimmedRestaurantNameUserInput.length) {
      const restaurantNameArray = trimmedRestaurantNameUserInput?.split(" ");
      const restaurantNameUpperCase = restaurantNameArray?.map(
        (item) => item[0].toUpperCase() + item.substring(1)
      );
      trimmedRestaurantNameUserInput = restaurantNameUpperCase?.join(" ");

      const validRestaurantName = restaurantData?.filter(
        (item) => item.name === trimmedRestaurantNameUserInput
      );

      if (!validRestaurantName?.length) {
        //TODO: error handling
        console.log("error: you have entered an incorrect state value");
      }
      onRestaurantNameUserInputChange(trimmedRestaurantNameUserInput);
    }
    // valid zipCode
    if (trimmedZipCode.length) {
      //TODO: check valid zipcode
      const validZip = zipData?.filter((item) => {
        return item.value === trimmedZipCode;
      });
      if (!validZip?.length) {
        //TODO: error handling
        console.log("no valid zip");
      }
      onZipcodeUserInputChange(trimmedZipCode);
    }
  };

  const zipCodeSearchResult = useQuery(
    ["getZipCodeSearch", zipcodeUserInput],
    () => fetchZipSearch(zipcodeUserInput),
    {
      enabled: false,
      onSuccess: (data) => {
        console.log("success case");
        console.log(zipcodeUserInput);
        // const mapLocations: GeoJSON.FeatureCollection<
        //   GeoJSON.Geometry,
        //   PropertiesProps
        // > = {
        //   type: "FeatureCollection",
        //   features: data.length ? data : [],
        // };
        //setMapData(mapLocations);
        //setRefreshMapData(true);
        // setZipcodeUserInput("");
      },
    }
  );

  const onSubmit = () => {
    console.log("hello I ran");
    sanitizeUserInput();
    if (
      !zipcodeUserInput ||
      !stateUserInput ||
      !cityUserInput ||
      !restaurantNameUserInput
    ) {
      // TODO: error handling
      console.log("error: user didnt enter anything throw error");
    }
    dispatch(zipcodeChange(zipcodeUserInput));
    // TODO: set inputs in redux global state
    if (path === "/") {
      // redirect
      navigate("/search-display");
    } else {
      // depending on user input trigger backend call
      // TODO: I have to fix this using redux variables
      if (
        zipcodeUserInput.length &&
        !stateUserInput.length &&
        !cityUserInput.length &&
        !restaurantNameUserInput.length
      ) {
        console.log("hitting the right case");
        zipCodeSearchResult.refetch();
        // call the zipcode api and setMapData and makezipcodeUserInput null
      }
    }
  };

  // This function has to run regardless of any user input to populate auto-complete inputs of state, city, zipcode and restaurantName
  const URL = "/api/dev/getGeography";
  const geoLocationData = useQuery(
    "getGeography",
    async () => {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: {
        data: {
          citySet: cityDocument[];
          stateSet: stateDocument[];
          zipSet: ZipDocument[];
          restaurantSet: restaurantDocument[];
        };
      } = await response.json();
      return data.data;
    },
    {
      onSuccess: (data) => {
        const stateFormattedData = data.stateSet.map((item) => {
          return { ...item, value: item.name };
        });
        const cityFormattedData = data.citySet.map((item) => {
          return { ...item, value: item.name };
        });
        const zipFormattedData = data.zipSet.map((item: ZipDocument) => ({
          ...item,
          value: item.properties.zip,
        }));
        // might throw error since we are not sending any data
        const restaurantFormattedData = data.restaurantSet.map(
          (item: restaurantDocument) => ({
            ...item,
            value: item.name,
          })
        );
        setStateData(stateFormattedData);
        setCityData(cityFormattedData);
        setRestaurantData(restaurantFormattedData);
        setZipData(zipFormattedData);
      },
    }
  );

  if (geoLocationData.isLoading) {
    return <span>Loading...</span>;
  }

  if (geoLocationData.isError) {
    return <span>Error: error occured</span>;
  }

  return (
    <React.Fragment>
      {path === "/" ? (
        <React.Fragment>
          <Autocomplete
            label="name"
            placeholder="Start typing to see options"
            value={restaurantNameUserInput}
            limit={7}
            onChange={onRestaurantNameUserInputChange}
            data={restaurantData ? restaurantData : []}
          />
          <Group position="center" spacing="xl" grow={true}>
            {errorZipcodeUserInput ? (
              <Autocomplete
                label="Zip code"
                error="Please provide valid zipcode"
                onChange={onZipcodeUserInputChange}
                data={[]}
                value={zipcodeUserInput}
              />
            ) : (
              <Autocomplete
                label="zipcode"
                placeholder={`${
                  cityUserInput.length || stateUserInput.length
                    ? "state & city must be empty to search"
                    : "Start typing to see options"
                } `}
                value={zipcodeUserInput}
                limit={7}
                disabled={Boolean(
                  cityUserInput.length || stateUserInput.length
                )}
                onChange={onZipcodeUserInputChange}
                data={zipData ? zipData : []}
              />
            )}
            {errorCityUserInput ? (
              <Autocomplete
                label="city"
                error="Please provide valid city"
                placeholder="start typing"
                value={cityUserInput}
                onChange={onCityUserInputChange}
                data={[]}
              />
            ) : (
              <Autocomplete
                label="city"
                placeholder={`${
                  zipcodeUserInput.length
                    ? "zipcode must be empty to search"
                    : "Start typing to see options"
                } `}
                value={cityUserInput}
                limit={7}
                disabled={Boolean(zipcodeUserInput.length)}
                onChange={onCityUserInputChange}
                data={cityData ? cityData : []}
              />
            )}
            {errorStateUserInput ||
            (cityUserInput.length > 0 && stateUserInput.length === 0) ? (
              <Autocomplete
                label="state"
                error={`${
                  cityUserInput.length > 0 && stateUserInput.length === 0
                    ? "state required if you are searching by city"
                    : "Please provide valid state value"
                }`}
                placeholder={`${
                  cityUserInput.length > 0 && stateUserInput.length === 0
                    ? ""
                    : "start typing"
                }`}
                value={stateUserInput}
                onChange={onStateUserInputChange}
                data={[]}
              />
            ) : (
              <Autocomplete
                label="state"
                placeholder={`${
                  zipcodeUserInput.length
                    ? "zipcode must be empty to search"
                    : "Start typing to see options"
                } `}
                value={stateUserInput}
                limit={7}
                disabled={Boolean(zipcodeUserInput.length)}
                onChange={onStateUserInputChange}
                data={stateData ? stateData : []}
                required={cityUserInput.length > 0}
              />
            )}
            <Button
              disabled={
                errorCityUserInput ||
                errorZipcodeUserInput ||
                errorStateUserInput ||
                (cityUserInput.length > 0 && stateUserInput.length === 0)
              }
              onClick={() => {
                onSubmit();
                console.log("clicked");
              }}
            >
              Submit
            </Button>
          </Group>
        </React.Fragment>
      ) : (
        <div>
          <React.Fragment>
            <Autocomplete
              label="name"
              placeholder="Start typing to see options"
              value={restaurantNameUserInput}
              limit={7}
              onChange={onRestaurantNameUserInputChange}
              data={restaurantData ? restaurantData : []}
            />
            <Group position="center" spacing="xl" grow={true}>
              {errorZipcodeUserInput ? (
                <Autocomplete
                  label="Zip code"
                  error="Please provide valid zipcode"
                  onChange={onZipcodeUserInputChange}
                  data={[]}
                  value={zipcodeUserInput}
                />
              ) : (
                <Autocomplete
                  label="zipcode"
                  placeholder={`${
                    cityUserInput.length || stateUserInput.length
                      ? "state & city must be empty to search"
                      : "Start typing to see options"
                  } `}
                  value={zipcodeUserInput}
                  limit={7}
                  disabled={Boolean(
                    cityUserInput.length || stateUserInput.length
                  )}
                  onChange={onZipcodeUserInputChange}
                  data={zipData ? zipData : []}
                />
              )}
              {errorCityUserInput ? (
                <Autocomplete
                  label="city"
                  error="Please provide valid city"
                  placeholder="start typing"
                  value={cityUserInput}
                  onChange={onCityUserInputChange}
                  data={[]}
                />
              ) : (
                <Autocomplete
                  label="city"
                  placeholder={`${
                    zipcodeUserInput.length
                      ? "zipcode must be empty to search"
                      : "Start typing to see options"
                  } `}
                  value={cityUserInput}
                  limit={7}
                  disabled={Boolean(zipcodeUserInput.length)}
                  onChange={onCityUserInputChange}
                  data={cityData ? cityData : []}
                />
              )}
              {errorStateUserInput ||
              (cityUserInput.length > 0 && stateUserInput.length === 0) ? (
                <Autocomplete
                  label="state"
                  error={`${
                    cityUserInput.length > 0 && stateUserInput.length === 0
                      ? "state required if you are searching by city"
                      : "Please provide valid state value"
                  }`}
                  placeholder={`${
                    cityUserInput.length > 0 && stateUserInput.length === 0
                      ? ""
                      : "start typing"
                  }`}
                  value={stateUserInput}
                  onChange={onStateUserInputChange}
                  data={[]}
                />
              ) : (
                <Autocomplete
                  label="state"
                  placeholder={`${
                    zipcodeUserInput.length
                      ? "zipcode must be empty to search"
                      : "Start typing to see options"
                  } `}
                  value={stateUserInput}
                  limit={7}
                  disabled={Boolean(zipcodeUserInput.length)}
                  onChange={onStateUserInputChange}
                  data={stateData ? stateData : []}
                  required={cityUserInput.length > 0}
                />
              )}
              <Button
                disabled={
                  errorCityUserInput ||
                  errorZipcodeUserInput ||
                  errorStateUserInput ||
                  (cityUserInput.length > 0 && stateUserInput.length === 0)
                }
                onClick={() => {
                  onSubmit();
                  console.log("clicked");
                }}
              >
                Submit
              </Button>
            </Group>
          </React.Fragment>
          <div>` yolo ${globalZipcodeValue.zipcode}</div>
        </div>
      )}
    </React.Fragment>
  );
};
