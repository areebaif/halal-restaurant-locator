import * as React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Card,
  Title,
  TextInput,
  Group,
  Button,
  Textarea,
  Grid,
  Loader,
  Flex,
  List,
} from "@mantine/core";
import { ErrorCard } from "@/components";

import { createFoodTag, CreateFoodTagResponseSchema } from "@/utils";
import { CreateFoodTagErrors } from "@/utils/types";

type AddFoodTag = {
  setIsOpenCreateFoodTag: (val: boolean) => void;
};

// TODO: open a popup to tell client that food tag is created and that they need to select from the list now

export const AddFoodTag: React.FC<AddFoodTag> = ({
  setIsOpenCreateFoodTag,
}) => {
  const queryClient = useQueryClient();
  const [createFoodTagInput, setCreateFoodTagInput] = React.useState("");
  const [createListFoodTag, setCreateListFoodTag] = React.useState<string[]>(
    []
  );
  const [errorVal, setErrorVal] = React.useState<string[]>([]);
  const [isError, setIsError] = React.useState(false);

  const mutation = useMutation({
    mutationFn: createFoodTag,
    onSuccess: (data) => {
      const result = CreateFoodTagResponseSchema.safeParse(data);
      if (!result.success) {
        console.log(result.error);

        return (
          <ErrorCard message="the server responded with incorrect types" />
        );
      }
      if (data.hasOwnProperty("apiErrors")) {
        const apiErrors = data as CreateFoodTagErrors;
        if (apiErrors.apiErrors?.generalErrors) {
          setErrorVal([...errorVal, ...apiErrors.apiErrors?.generalErrors]);
        }
        if (apiErrors.apiErrors?.validationErrors) {
          setErrorVal([
            ...errorVal,
            ...apiErrors.apiErrors?.validationErrors.foodTag,
          ]);
        }
        setIsError(true);
        return;
      }

      setCreateListFoodTag([]);
      setCreateFoodTagInput("");
      queryClient.invalidateQueries(["listFoodTags"]);
      setIsOpenCreateFoodTag(false);
    },
  });

  if (mutation.isLoading) {
    return <Loader />;
  }

  if (mutation.isError) {
    setErrorVal([...errorVal, "something went wrong while creating food tags"]);
  }

  const onSubmit = async (val: string[]) => {
    setIsError(false);
    if (!val.length) {
      setErrorVal([...errorVal, "The food tag field cannot be empty"]);
      setIsError(true);
      return;
    }
    mutation.mutate({ foodTag: createListFoodTag });
  };

  const onAdd = (val: string) => {
    setIsError(false);
    if (!val.length) {
      setErrorVal([...errorVal, "The food tag field cannot be empty"]);
      setIsError(true);
      return;
    }
    setCreateFoodTagInput("");
    setCreateListFoodTag([...createListFoodTag, val]);
  };

  const onDelete = (index: number) => {
    setCreateListFoodTag((foodTags) => foodTags.filter((tag, i) => index != i));
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
        <Title order={3}>Create Food Tag</Title>
      </Card.Section>

      <Grid>
        <Grid.Col span={4}>
          {" "}
          <Textarea
            defaultValue=" Use the add button to create multiple food tags at once in the database."
            sx={(theme) => ({
              marginTop: `calc(${theme.spacing.md}*2)`,
            })}
            disabled
          ></Textarea>
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="xs"
            withAsterisk
            label="name"
            placeholder="type here"
            type="text"
            value={createFoodTagInput}
            onChange={(event) =>
              setCreateFoodTagInput(event.currentTarget.value)
            }
          ></TextInput>
          {isError ? <ErrorCard arrayOfErrors={errorVal} /> : <></>}
        </Grid.Col>
        <Grid.Col span={4}>
          <Button
            onClick={() => onAdd(createFoodTagInput)}
            variant="outline"
            color="dark"
            sx={(theme) => ({ marginTop: `calc(${theme.spacing.md}*2)` })}
          >
            Add
          </Button>
        </Grid.Col>
      </Grid>
      {/* TODO: improve styling */}
      <Flex>
        <List>
          {createListFoodTag.map((tag, index) => (
            <Group>
              <List.Item key={index}>{tag}</List.Item>
              <Button onClick={() => onDelete(index)}>Delete</Button>
            </Group>
          ))}
        </List>
      </Flex>
      <Group position="center" mt="sm">
        <Button
          variant="outline"
          color="dark"
          size="sm"
          onClick={() => onSubmit(createListFoodTag)}
        >
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddFoodTag;
