import * as React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  Title,
  TextInput,
  Group,
  Button,
  Textarea,
  Grid,
  Loader,
  Autocomplete,
  Box,
  Table,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { PostAddCity, ResponseAddCity } from "@/utils/types";
import { useRouter } from "next/router";
import {
  capitalizeFirstWord,
  getStates,
  postAddCity,
  ReadStateDbZod,
  ResponseAddCityZod,
} from "@/utils";

export const AddCities: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [cityName, setCityName] = React.useState("");
  const [countryState, setCountryState] = React.useState("");
  const [allCity, setAllCity] = React.useState<PostAddCity>([]);
  const [error, setError] = React.useState<ResponseAddCity>();

  // Queries
  const apiData = useQuery(["getAllStates"], getStates, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const mutation = useMutation({
    mutationFn: postAddCity,
    onSuccess: (data) => {
      const result = ResponseAddCityZod.safeParse(data);
      if (!result.success) {
        console.log(result.error);
        return <ErrorCard message="unable to add state, please try again" />;
      }
      if (!data.created) {
        console.log(`error:`, data);
        if (data.country) setError({ ...error, country: data.country });
        if (data.state) setError({ ...error, state: data.state });
        if (data.city) setError({ ...error, state: data.city });
        if (data.typeError) setError({ ...error, typeError: data.typeError });
        return;
      }
      router.push("/admin");
      queryClient.invalidateQueries();
    },
    onError: (data) => {},
  });

  if (apiData.isLoading) return <Loader />;
  if (apiData.isError) {
    console.log(apiData.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }
  const isStateTypeCorrent = ReadStateDbZod.safeParse(apiData.data);
  if (!isStateTypeCorrent.success) {
    console.log(isStateTypeCorrent.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }
  if (mutation.isLoading) {
    return <Loader />;
  }

  const autoCompleteStateCountry = apiData.data.map((item) => ({
    value: item.countryNameStateName,
    countryid: item.countryId,
    stateid: item.stateId,
  }));

  const onSubmit = async (val: PostAddCity) => {
    setError(undefined);
    if (!val.length || val.length > 1) {
      setError({
        ...error,
        country: "Please add state to a single country",
      });
      return;
    }

    mutation.mutate(val);
  };

  const onAddCity = (cityVal: string) => {
    if (!cityVal.length) {
      // TODO: I have to do error handling
    }
    const sanitizeCity = capitalizeFirstWord(cityVal);
    const countryStateIdArray = autoCompleteStateCountry.filter(
      (item) => item.value === countryState
    );
    // TODO: error handling if country is not defined
    if (!countryStateIdArray.length) {
      console.log(" I have to do eror handling");
    }
    const countryId = countryStateIdArray[0].countryid;
    const stateId = countryStateIdArray[0].stateid;
    let index;
    const filterState = allCity.filter((item, itemIndex) => {
      if (item.stateId === stateId) {
        index = itemIndex;
      }
      return item.stateId === stateId;
    });
    if (filterState.length) {
      const updateAllCity = [...allCity];
      updateAllCity[index!].cityName.push(sanitizeCity);
      setAllCity([...updateAllCity]);
    } else {
      const updateAllCity = [...allCity];

      updateAllCity.push({
        countryId: countryId,
        stateId: stateId,
        countryState: countryState,
        cityName: [sanitizeCity],
      });
      setAllCity(updateAllCity);
    }

    setCityName("");
  };

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        overflow: "inherit",
        margin: "15px 0 0 0",
      }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Add City Name</Title>
      </Card.Section>

      <Grid>
        <Grid.Col span={"auto"}>
          {" "}
          <Textarea
            defaultValue="Select country - state to add multiple cities. You can add multiple cities for one country in a single form submission."
            mt="md"
            minRows={4}
            disabled
          ></Textarea>
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <Autocomplete
            mt="sm"
            withAsterisk
            description="select from a list of available: country - state"
            placeholder="select country - state"
            label={"country - state"}
            data={autoCompleteStateCountry}
            value={countryState}
            onChange={setCountryState}
          />
          {error?.country ? <ErrorCard message={error?.country} /> : <></>}
          {error?.state ? <ErrorCard message={error?.state} /> : <></>}
        </Grid.Col>

        <Grid.Col span={"auto"}>
          <TextInput
            mt="sm"
            withAsterisk
            value={cityName}
            description="press enter to add city"
            label="city"
            placeholder="type here"
            type="text"
            onKeyDown={(event) => {
              event.key === "Enter" ? onAddCity(cityName) : undefined;
            }}
            onChange={(event) => setCityName(event.currentTarget.value)}
          ></TextInput>
          {error?.city ? <ErrorCard message={error?.city} /> : <></>}
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <Box pt="lg" mt="lg">
            <Button
              mt="md"
              variant="outline"
              color="dark"
              size="sm"
              onClick={() => onAddCity(cityName)}
            >
              Add
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
      {error?.typeError ? <ErrorCard message={error?.typeError} /> : <></>}
      <DisplayCities allCity={allCity} setAllCity={setAllCity} />
      <Group position="center" mt="sm">
        <Button color="dark" size="sm" onClick={() => onSubmit(allCity)}>
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddCities;

type DisplayCityProps = {
  allCity: PostAddCity;
  setAllCity: (val: PostAddCity) => void;
};
export const DisplayCities: React.FC<DisplayCityProps> = ({
  allCity,
  setAllCity,
}) => {
  const onDelete = (countryState: string, city: string) => {
    const updateAllCity = [...allCity];
    const newCity = updateAllCity.map((item) => {
      if (item.countryState === countryState) {
        const filteredCities = item.cityName.filter((item) => item !== city);
        return {
          countryId: item.countryId,
          stateId: item.stateId,
          countryState: item.countryState,
          cityName: [...filteredCities],
        };
      } else return { ...item };
    });
    // TODO: error handling if countryState not found
    setAllCity([...newCity]);
  };

  return allCity.length ? (
    <Table mt="xl" fontSize="lg" highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Country - State</th>
          <th>City</th>
          <th>Delete</th>
        </tr>
      </thead>

      {allCity.map((item, index) => (
        <tbody key={index}>
          {item.cityName.map((city, index) => (
            <tr key={index}>
              <td>{item.countryState}</td>
              <td>{city}</td>
              <td>
                <Button onClick={() => onDelete(item.countryState, city)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </Table>
  ) : (
    <></>
  );
};
