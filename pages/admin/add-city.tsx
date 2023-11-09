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
import { PostAddCity, ResponseAddState } from "@/utils/types";

import { useRouter } from "next/router";
import { getStates, postAddState } from "@/utils/crudFunctions";
import { capitalizeFirstWord } from "@/utils";
import { ReadStateDbZod, ResponseAddStateZod } from "@/utils/zod/zod";

export const AddCities: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [cityName, setCityName] = React.useState("");
  const [countryState, setCountryState] = React.useState("");
  const [allCity, setAllCity] = React.useState<PostAddCity>([]);
  const [error, setError] = React.useState<ResponseAddState>();

  // Queries
  const apiData = useQuery(["getAllStates"], getStates, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const mutation = useMutation({
    mutationFn: postAddState,
    onSuccess: (data) => {
      const result = ResponseAddStateZod.safeParse(data);
      if (!result.success) {
        console.log(result.error);
        return <ErrorCard message="unable to add state, please try again" />;
      }
      if (!data.created) {
        console.log(`error:`, data);
        if (data.country) setError({ ...error, country: data.country });
        if (data.state) setError({ ...error, state: data.state });
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

    //mutation.mutate(val);
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
      if (item.countryId === countryId) {
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
            defaultValue="Select country -state to add multiple cities. You can add multiple cities in different states for one country in a single form submission."
            mt="md"
            minRows={3}
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
          {error?.state ? <ErrorCard message={error?.state} /> : <></>}
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
      {/* <DisplayStates allState={allState} setAllState={setAllState} /> */}
      <Group position="center" mt="sm">
        <Button color="dark" size="sm" onClick={() => onSubmit(allCity)}>
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddCities;

type DisplayStateProp = {
  allState: { countryId: string; countryName: string; stateName: string[] }[];
  setAllState: (
    val: { countryId: string; countryName: string; stateName: string[] }[]
  ) => void;
};
export const DisplayStates: React.FC<DisplayStateProp> = ({
  allState,
  setAllState,
}) => {
  const onDelete = (countryId: string, countryName: string, state: string) => {
    const updateAllState = [...allState];
    const newState = updateAllState.map((item) => {
      if (item.countryId === countryId) {
        const filteredStates = item.stateName.filter((item) => item !== state);
        return {
          countryId: countryId,
          countryName: countryName,
          stateName: [...filteredStates],
        };
      } else return { ...item };
    });
    // TODO: error handling

    setAllState([...newState]);
  };

  return allState.length ? (
    <Table mt="xl" fontSize="lg" highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Country</th>
          <th>State</th>
          <th>Delete</th>
        </tr>
      </thead>

      {allState.map((item, index) => (
        <tbody key={index}>
          {item.stateName.map((state, index) => (
            <tr key={index}>
              <td>{item.countryName}</td>
              <td>{state}</td>
              <td>
                <Button
                  onClick={() =>
                    onDelete(item.countryId, item.countryName, state)
                  }
                >
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
