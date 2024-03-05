import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Chip, Group, Loader, Textarea, Grid, Button } from "@mantine/core";
import { listFoodTags, ListFoodTagsResponseZod } from "@/utils";
import { ErrorCard, AddFoodTag } from "@/components";
import { ListFoodTags, ListFoodTagsError } from "@/utils/types";

export type FoodTags = {
  foodTag: string[];
  setFoodTag: (val: string[]) => void;
};

export const FoodTags: React.FC<FoodTags> = ({ foodTag, setFoodTag }) => {
  const [isOpenCreateFoodTag, setIsOpenCreateFoodTag] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [errorVal, setIsErrorVal] = React.useState<{ foodTag: string[] }>({
    foodTag: [],
  });

  const foodTagData = useQuery(["listFoodTags"], listFoodTags, {
    staleTime: Infinity,
    cacheTime: Infinity,
    onSuccess: (data) => {
      const isFoodTagTypeCorrent = ListFoodTagsResponseZod.safeParse(data);

      if (!isFoodTagTypeCorrent.success) {
        console.log(isFoodTagTypeCorrent.error);
        return <ErrorCard message="Their is a type mismatch from the server" />;
      }

      if (data.hasOwnProperty("apiErrors")) {
        const apiErrors = data as ListFoodTagsError;
        if (apiErrors.apiErrors?.generalErrors) {
          setIsErrorVal({
            foodTag: [
              ...errorVal.foodTag,
              ...apiErrors.apiErrors?.generalErrors,
            ],
          });
        }
        setIsError(true);
      }
    },
  });

  if (foodTagData.isLoading) return <Loader />;
  console.log(foodTag, "slsl");
  if (foodTagData.isError) {
    console.log(foodTagData.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }
  const apiFoodtags = foodTagData.data as ListFoodTags;
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
              {apiFoodtags.map((tag, index) => (
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
      {isError && <ErrorCard arrayOfErrors={errorVal.foodTag} />}
      {isOpenCreateFoodTag && (
        <AddFoodTag setIsOpenCreateFoodTag={setIsOpenCreateFoodTag} />
      )}
    </>
  );
};
