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
import {  PostAddState, ResponseAddState } from "@/utils/types";

import { useRouter } from "next/router";
import { getAllCountries, postAddState } from "@/utils/crudFunctions";
import { ReadCountriesDbZod } from "@/utils";
import { capitalizeFirstWord } from "@/utils";
import { ResponseAddStateZod } from "@/utils/zod/zod";

export const AddStates: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [stateName, setStateName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [allState, setAllState] = React.useState<PostAddState>([]);
  const [error, setError] = React.useState<ResponseAddState>();

  // Queries
  const allCountriesData = useQuery(["getAllCountries"], getAllCountries, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (allCountriesData.isLoading) return <Loader />;
  if (allCountriesData.isError) {
    console.log(allCountriesData.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }

  const isCountriesTypeCorrent = ReadCountriesDbZod.safeParse(
    allCountriesData.data
  );
  if (!isCountriesTypeCorrent.success) {
    console.log(isCountriesTypeCorrent.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }

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

  if (mutation.isLoading) {
    return <Loader />;
  }
  const autoCompleteData = allCountriesData.data.countries.map((item) => ({
    value: item.countryName,
    countryid: item.countryId,
  }));
  const onSubmit = async (val: PostAddState) => {
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

  const onAddState = (stateVal: string) => {
    if (!stateVal.length) {
      // TODO: I have to do error handling
    }
    const sanitizeState = capitalizeFirstWord(stateVal);
    const countryIdArray = autoCompleteData.filter(
      (item) => item.value === country
    );
    // TODO: error handling if country is not defined
    if (!countryIdArray.length) {
      console.log(" I have to do eror handling");
    }
    const countryId = countryIdArray[0].countryid;
    const countryName = countryIdArray[0].value;
    let index;
    const filterCountry = allState.filter((item, itemIndex) => {
      if (item.countryId === countryId) {
        index = itemIndex;
      }
      return item.countryId === countryId;
    });
    if (filterCountry.length) {
      const updateAllState = [...allState];
      updateAllState[index!].stateName.push(sanitizeState);
      setAllState([...updateAllState]);
    } else {
      const updateAllState = [...allState];
      updateAllState.push({
        countryId: countryId,
        countryName: countryName,
        stateName: [sanitizeState],
      });
      setAllState(updateAllState);
    }

    setStateName("");
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
        <Title order={3}>Add State Name</Title>
      </Card.Section>

      <Grid>
        <Grid.Col span={"auto"}>
          {" "}
          <Textarea
            defaultValue="Select country to add multiple states. You can add multiple states for one country in a single form submission."
            mt="md"
            disabled
          ></Textarea>
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <Autocomplete
            mt="sm"
            withAsterisk
            placeholder="select country"
            label={"country"}
            data={autoCompleteData}
            value={country}
            onChange={setCountry}
          />
          {error?.country ? <ErrorCard message={error?.country} /> : <></>}
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <TextInput
            mt="sm"
            withAsterisk
            value={stateName}
            label="state"
            placeholder="type here"
            type="text"
            onChange={(event) => setStateName(event.currentTarget.value)}
          ></TextInput>
          {error?.state ? <ErrorCard message={error?.state} /> : <></>}
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <Box mt="xl">
            <Button
              mt="sm"
              variant="outline"
              color="dark"
              size="sm"
              onClick={() => onAddState(stateName)}
            >
              Add
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
      {error?.typeError ? <ErrorCard message={error?.typeError} /> : <></>}
      <DisplayStates allState={allState} setAllState={setAllState} />
      <Group position="center" mt="sm">
        <Button color="dark" size="sm" onClick={() => onSubmit(allState)}>
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddStates;

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
