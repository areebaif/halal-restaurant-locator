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
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { ErrorAddFoodTag } from "@/utils/types";
import { ReadCountriesDbZod } from "@/utils";
import { getAllCountries } from "@/utils/crudFunctions";
import { useRouter } from "next/router";

export const AddCity: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [foodTag, setFoodTag] = React.useState("");
  const [error, setError] = React.useState<ErrorAddFoodTag>();
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

  const onSubmit = async (val: string) => {
    setError(undefined);
    if (!val.length) {
      setError({
        ...error,
        foodTag: "The food tag field cannot be empty",
      });
      return;
    }
    // mutation.mutate({ foodTag: foodTag });
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
        <Title order={3}>Add Cities</Title>
      </Card.Section>
      <Grid>
        <Grid.Col span={3}>
          {" "}
          <Textarea
            defaultValue="Typeof food served by the restaurant. Examples include vegetarian,
            fast food, seafood"
            label="description"
            mt="xs"
            disabled
          ></Textarea>
        </Grid.Col>
        <Grid.Col span={9}>
          <TextInput
            mt="xs"
            withAsterisk
            label="name"
            placeholder="type here"
            type="text"
            onChange={(event) => setFoodTag(event.currentTarget.value)}
          ></TextInput>
          {error?.foodTag ? <ErrorCard message={error?.foodTag} /> : <></>}
        </Grid.Col>
      </Grid>
      <Group position="center" mt="sm">
        <Button
          variant="outline"
          color="dark"
          size="sm"
          onClick={() => onSubmit(foodTag)}
        >
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddCity;
