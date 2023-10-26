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
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { ErrorAddFoodTag, PostAddState, ResponseAddFoodTag } from "@/utils/types";

import { useRouter } from "next/router";
import { getAllCountries } from "@/utils/crudFunctions";
import { ReadCountriesDbZod } from "@/utils/zod/zod";
import { capitalizeFirstWord } from "@/utils";
// TODO fix this file we need to add country and then state submission to the backend will be an array of states
export const AddStates: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [stateName, setStateName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [allState, setAllState] = React.useState<PostAddState>();
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
  console.log(allCountriesData.data, "s");
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
    const sanitizeState = capitalizeFirstWord(stateVal);
    const countryIdArray = autoCompleteData.filter(
      (item) => item.value === country
    );
    const countryId = countryIdArray[0].countryid;

    // if (!allState?.countryId ) {
    //   allState?.countryId= countryId
    // }
   
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
        <Grid.Col span={2}>
          {" "}
          <Textarea
            defaultValue="Select country to add multiple states."
            mt="md"
            disabled
          ></Textarea>
        </Grid.Col>
        <Grid.Col span={3}>
          <Autocomplete
            mt="sm"
            placeholder="select country"
            label={"country"}
            data={autoCompleteData}
            value={country}
            onChange={setCountry}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            mt="xs"
            withAsterisk
            label="state"
            placeholder="type here"
            type="text"
            onChange={(event) => setStateName(event.currentTarget.value)}
          ></TextInput>
        </Grid.Col>
      </Grid>
      <Group position="center" mt="sm">
        <Button
          variant="outline"
          color="dark"
          size="sm"
          onClick={() => onSubmit(stateName)}
        >
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddStates;
