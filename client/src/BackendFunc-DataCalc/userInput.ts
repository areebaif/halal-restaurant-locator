import {
  ZipDocument,
  RestaurantDocument,
  CityDocument,
  StateDocument,
} from "../BackendFunc-DataCalc/backendFunctions";

export interface ValidateUserInput {
  userInput: string;
  backendCityData: CityDocument[];
  backendStateData: StateDocument[];
  backendZipData: ZipDocument[];
  backendRestaurantData: RestaurantDocument[];
}

export const validateUserInput = (data: ValidateUserInput) => {
  const {
    userInput,
    backendCityData,
    backendStateData,
    backendZipData,
    backendRestaurantData,
  } = data;
  // return object
  const validateResult: {
    city?: { id: number; name: string };
    state?: StateDocument;
    zipcode?: { id: number; name: string };
    restaurant?: {
      id?: number;
      name: string;
      street?: string;
      city?: string;
      state?: string;
      zipcode?: string;
    };
  } = {};

  const trimmedUserInput = userInput?.trim();
  const userInputArray = trimmedUserInput.split(",");
  const userInputArrayLength = userInputArray.length;
  // TODO: handle restaurant case
  // it will be either one or 5 length
  try {
    switch (userInputArrayLength) {
      // This is the case when the user is searching by city and state
      case 2:
        const cityArray = [userInputArray[0].trim()];
        const stateArray = [userInputArray[1].trim()];

        const state = validInput(stateArray, backendStateData);
        const stateId = state?.id;
        const city = validInput(cityArray, backendCityData, stateId);
        validateResult.state = state;
        validateResult.city = city;
        break;
      case 3:
        // state, city and zipcode are defined

        const zipcode = userInputArray[2].trim();

        const validZip = backendZipData?.filter((item) => {
          return item.properties.zipcode === zipcode;
        });
        if (!validZip?.length) {
          //TODO: error handling
          console.log("no valid zip");
        }
        const cityArr = [userInputArray[0].trim()];

        const stateArr = [userInputArray[1].trim()];
        const cityWithZip = validInput(cityArr, backendCityData);
        const stateWithZip = validInput(stateArr, backendStateData);
        const zip = {
          id: validZip[0].id,
          name: zipcode,
        };
        validateResult.zipcode = zip;
        validateResult.state = stateWithZip;
        validateResult.city = cityWithZip;
        break;
      case 1:
        // state
        const value = [userInputArray[0].trim()];
        const onlyState = validInput(value, backendStateData);
        if (onlyState) {
          validateResult.state = onlyState;
        }
        // if (restaurant) {
        //   validateResult.restaurant = restaurant;
        // }
        break;
    }
    return validateResult;
  } catch (err) {
    throw new Error("invalid user input");
  }
};

export const validInput = (
  userInput: string[],
  backendData: { id: number; name: string; state_id?: number }[],
  state_id?: number
) => {
  const valueUpperCase = userInput[0]
    ?.split(" ")
    .map((item) => item[0].toUpperCase() + item.substring(1));
  const value = valueUpperCase.join(" ");
  const validValue = state_id
    ? backendData.filter((item) => {
        return item.name === value && item.state_id === state_id;
      })
    : backendData.filter((item) => {
        return item.name === value;
      });
  // set query string value
  const queryStringValue = validValue.length ? validValue?.[0] : undefined;
  if (queryStringValue) {
    const queryString = {
      id: queryStringValue?.id,
      name: queryStringValue?.name,
    };
    return queryString;
  }

  return undefined;
};
