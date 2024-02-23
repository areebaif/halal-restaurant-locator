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

import { createFoodTag, CreateFoodTagZod, listFoodTags } from "@/utils";
import { CreateFoodTag } from "@/utils/types";

type AddFoodTag = {
  setIsOpenCreateFoodTag: (val: boolean) => void;
};

export const AddFoodTag: React.FC<AddFoodTag> = ({
  setIsOpenCreateFoodTag,
}) => {
  const queryClient = useQueryClient();
  const [createFoodTagInput, setCreateFoodTagInput] = React.useState("");
  const [createListFoodTag, setCreateListFoodTag] = React.useState<string[]>(
    []
  );
  const [error, setError] = React.useState<CreateFoodTag["errors"]>();

  const mutation = useMutation({
    mutationFn: createFoodTag,
    onSuccess: (data) => {
      const result = CreateFoodTagZod.safeParse(data);
      if (!result.success) {
        console.log(result.error);
        return (
          <ErrorCard message="the server responded with incorrect types" />
        );
      }
      // these are the errors returned by backend that we need to show the client
      if (data.errors) {
        setError(data.errors);
        return;
      }

      setCreateListFoodTag([]);
      setCreateFoodTagInput("");
      queryClient.invalidateQueries(["getAllFoodTags"]);
      setIsOpenCreateFoodTag(false);
    },
  });

  if (mutation.isLoading) {
    return <Loader />;
  }

  if (mutation.isError) {
    setError({
      generalErrors: ["something went wrong while creating food tags"],
    });
  }

  const onSubmit = async (val: string[]) => {
    setError(undefined);
    if (!val.length) {
      setError({
        ...error,
        validationErrors: {
          foodTag: ["The food tag field cannot be empty"],
        },
      });
      return;
    }
    mutation.mutate({ foodTag: createListFoodTag });
  };

  const onAdd = (val: string) => {
    setError(undefined);
    if (!val.length) {
      setError({
        ...error,
        validationErrors: {
          foodTag: ["The food tag field cannot be empty"],
        },
      });
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
          {error?.validationErrors?.foodTag ? (
            <ErrorCard arrayOfErrors={error.validationErrors.foodTag} />
          ) : (
            <></>
          )}
          {error?.generalErrors ? (
            <ErrorCard arrayOfErrors={error.generalErrors} />
          ) : (
            <></>
          )}
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
              <List.Item>{tag}</List.Item>
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
