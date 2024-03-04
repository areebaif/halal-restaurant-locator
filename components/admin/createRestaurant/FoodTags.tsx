import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Chip,
  Group,
  Loader,
  Textarea,
  Grid,
  Button,
  Card,
} from "@mantine/core";
import { listFoodTags, ListFoodTagsZod } from "@/utils";
import { ErrorCard, AddFoodTag } from "@/components";

export type FoodTags = {
  foodTag: string[];
  setFoodTag: (val: string[]) => void;
};

export const FoodTags: React.FC<FoodTags> = ({ foodTag, setFoodTag }) => {
  const [isOpenCreateFoodTag, setIsOpenCreateFoodTag] = React.useState(false);
  const foodTagData = useQuery(["listFoodTags"], listFoodTags, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (foodTagData.isLoading) return <Loader />;

  if (foodTagData.isError) {
    console.log(foodTagData.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }

  const isFoodTagTypeCorrent = ListFoodTagsZod.safeParse(foodTagData.data);

  if (!isFoodTagTypeCorrent.success) {
    console.log(isFoodTagTypeCorrent.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }

  return (
    <>
      <Grid>
        <Grid.Col span={3}>
          <Textarea
            label="food tags"
            withAsterisk
            disabled
            autosize
            defaultValue={
              "Select all that apply. If you do not see a tag listed, then select create tag button to add tags to the database."
            }
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <Chip.Group multiple value={foodTag} onChange={setFoodTag}>
            {/* <label
            style={{
              display: "inline-block",
              fontSize: "0.875rem",
              fontWeight: 500,
              wordBreak: "break-word",
            }}
          >
            food tags
          </label> */}
            {/* <span style={{ color: "#fa5252", marginLeft: "1px" }}> </span> */}
            <Group
              sx={(theme) => ({ marginTop: `calc(${theme.spacing.md}*2)` })}
            >
              {foodTagData.data.map((tag, index) => (
                <Chip key={index} value={`${tag.foodTagId}`}>
                  {tag.name}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
        </Grid.Col>
        <Grid.Col span={1}>
          <Button
            onClick={() => {
              setIsOpenCreateFoodTag(true);
            }}
            size="sm"
            sx={(theme) => ({ marginTop: `calc(${theme.spacing.md}*2)` })}
            color="dark"
            variant="outline"
          >
            Create
          </Button>
        </Grid.Col>
      </Grid>
      {isOpenCreateFoodTag && (
        <AddFoodTag setIsOpenCreateFoodTag={setIsOpenCreateFoodTag} />
      )}
    </>
  );
};
