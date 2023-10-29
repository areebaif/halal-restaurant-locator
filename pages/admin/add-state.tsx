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
  Flex,
  ActionIcon,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import {
  ErrorAddFoodTag,
  PostAddState,
  ResponseAddFoodTag,
} from "@/utils/types";

import { useRouter } from "next/router";
import { getAllCountries } from "@/utils/crudFunctions";
import { ReadCountriesDbZod } from "@/utils/zod/zod";
import { capitalizeFirstWord } from "@/utils";
import { IconTrash } from "@tabler/icons-react";
// TODO fix this file we need to add country and then state submission to the backend will be an array of states
export const AddStates: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [stateName, setStateName] = React.useState("");
  const [country, setCountry] = React.useState("");
  // addState is a map with key as countryId: Map ensures that the key is unique.
  // the value for each key is a set of StateName: set ensures that states are not added twice to each country
  // In Pure JS => {countryId: [stateName1, stateName2, ...] } where countryid is unique and the array associated with countryId holds unique stateNames
  const [allState, setAllState] = React.useState<PostAddState>([]);
  const [error, setError] = React.useState<ErrorAddFoodTag>();

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
  //console.log(allCountriesData.data, "s");
  // TODO: fix the mutation to send an array of states
  // const mutation = useMutation({
  //   mutationFn: postAddFoodTag,
  //   onSuccess: (data) => {
  //     const result = ResponseAddFoodTagZod.safeParse(data);
  //     if (!result.success) {
  //       console.log(result.error);
  //       return (
  //         <ErrorCard message="the server responded with incorrect types" />
  //       );
  //     }
  //     if (data.foodTag) {
  //       setError({ ...error, foodTag: data.foodTag });
  //       return;
  //     }
  //     router.push("/admin");
  //     queryClient.invalidateQueries();
  //   },
  //   onError: (data) => {},
  // });

  // if (mutation.isLoading) {
  //   return <Loader />;
  // }
  const autoCompleteData = allCountriesData.data.countries.map((item) => ({
    value: item.countryName,
    countryid: item.countryId,
  }));
  const onSubmit = async (val: string) => {
    setError(undefined);
    if (!val.length) {
      setError({
        ...error,
        foodTag: "The food tag field cannot be empty",
      });
      return;
    }
    // TODO: string[], countrtyId
    //mutation.mutate({ state: val });
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
      console.log(" I have to dpo eror handling");
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
            defaultValue="Select country to add multiple states. Add button will populate a list of states with corresponding country."
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
      <DisplayStates
        allState={allState}
        setAllState={setAllState}
        autoCompleteData={autoCompleteData}
      />
      <Group position="center" mt="sm">
        <Button color="dark" size="sm" onClick={() => onSubmit(stateName)}>
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
  autoCompleteData: { value: string; countryid: string }[];
};
export const DisplayStates: React.FC<DisplayStateProp> = ({
  allState,
  setAllState,
  autoCompleteData,
}) => {
  //const mappedStateData: { [key: string]: string[] }[] = [];
  // allState.forEach((value, key) => {
  //   // find each key in autoCompleteData
  //   // set the key in mappeddata with its value
  //   const countryIdArray = autoCompleteData.filter(
  //     (item) => item.countryid === key
  //   );
  //   const stateArray: string[] = [];
  //   value.forEach((state) => {
  //     stateArray.push(state);
  //   });
  //   const countryName = countryIdArray[0].value;
  //   const countrySateValue = { [countryName]: stateArray };
  //   mappedStateData.push(countrySateValue);
  // });

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
