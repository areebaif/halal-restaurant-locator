import * as React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  Title,
  TextInput,
  Group,
  Button,
  Loader,
  Autocomplete,
  Chip,
  FileInput,
  Textarea,
  Grid,
} from "@mantine/core";
import { ErrorCard, CustomImageButton } from "@/components";
import {
  ReadZipcodeDbZod,
  getZipcode,
  getFoodTags,
  ReadFoodTagsDbZod,
} from "@/utils";

const AddRestaurant: React.FC = () => {
  const [name, setName] = React.useState("");
  const [countryStateCityZipcode, setCountryStateCityZipcode] =
    React.useState("");
  const [latitude, setLatitude] = React.useState<string>("");
  const [longitude, setLongitude] = React.useState<string>("");
  const [foodTag, setFoodTag] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");
  const [street, setStreet] = React.useState("");
  // we are constructing url from uploaded image to display a preview image of the image uplaoded to the user.
  // Hence, the need for url.
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [images, setImages] = React.useState<File[]>([]);
  // Queries
  const apiData = useQuery(["getAllZipcode"], getZipcode, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const foodTagData = useQuery(["getAllFoodTags"], getFoodTags, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (apiData.isLoading || foodTagData.isLoading) return <Loader />;
  if (apiData.isError || foodTagData.isError) {
    console.log(apiData.error);
    console.log(foodTagData.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }
  const isTypeCorrent = ReadZipcodeDbZod.safeParse(apiData.data);
  const isFoodTagTypeCorrent = ReadFoodTagsDbZod.safeParse(foodTagData.data);

  if (!isTypeCorrent.success) {
    console.log(isTypeCorrent.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }

  if (!isFoodTagTypeCorrent.success) {
    console.log(isFoodTagTypeCorrent.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }

  const autoCompleteCountryStateCityZipcode = apiData.data.map((item) => ({
    value: item.countryStateCityZipcode,
    zipcodeid: item.zipcodeId,
    countryid: item.countryId,
    stateid: item.stateId,
    cityid: item.cityId,
  }));

  const onSubmit = () => {
    console.log(coverImage, "slslslsl");
    // we might extract it out as separate function
    // We are handling image uploads first, then we will come back to implement submit function properly
    // we need to create a cover imageurl/ extract, size and type amnd create appropriate objects
    const restaurantId = uuidv4();
    const images = {
      cover: {
        imageId: `/${restaurantId}/cover/${uuidv4()}`,
      },
      // other: [
      //   {
      //     type: seatingImage.image?.type,
      //     size: coverImage.image?.size,
      //     imageId: `/${restaurantId}/cover/${uuidv4()}`,
      //   },
      //   {
      //     type: coverImage.image?.type,
      //     size: coverImage.image?.size,
      //     imageId: `/${restaurantId}/cover/${uuidv4()}`,
      //   },
      // ],
    };
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
        <Title order={3}>Add Restaurant</Title>
      </Card.Section>
      <TextInput
        mt="xs"
        withAsterisk
        label="name"
        value={name}
        placeholder="type here"
        type="text"
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <TextInput
        mt="xs"
        withAsterisk
        label="description"
        value={description}
        placeholder="type here"
        type="text"
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <TextInput
        mt="xs"
        withAsterisk
        label="street"
        value={street}
        placeholder="type here"
        type="text"
        onChange={(event) => setStreet(event.currentTarget.value)}
      />
      <Autocomplete
        mt="sm"
        withAsterisk
        description="select from a list of: country - state - city - zipcode"
        placeholder="select country - state - city - zipcode"
        label={"country - state - city - zipcode"}
        data={autoCompleteCountryStateCityZipcode}
        value={countryStateCityZipcode}
        onChange={setCountryStateCityZipcode}
      />
      <TextInput
        mt="sm"
        withAsterisk
        label="latitude"
        description="latitude range -90 to 90"
        value={latitude}
        onChange={(e) => setLatitude(e.currentTarget.value)}
      />
      {/* This need to be autocomplete with data from backend */}
      <TextInput
        mt="sm"
        mb="sm"
        withAsterisk
        label="longitude"
        description="longitude range -180 to 180."
        value={longitude}
        onChange={(e) => setLongitude(e.currentTarget.value)}
      />

      <Chip.Group multiple value={foodTag} onChange={setFoodTag}>
        <label
          style={{
            display: "inline-block",
            fontSize: "0.875rem",
            fontWeight: 500,
            wordBreak: "break-word",
          }}
        >
          food tags
        </label>
        <span style={{ color: "#fa5252", marginLeft: "1px" }}>*</span>
        <Group>
          {foodTagData.data.map((tag) => (
            <Chip value={`${tag.foodTagId}`}>{tag.name}</Chip>
          ))}
        </Group>
      </Chip.Group>
      <Grid>
        <Grid.Col span={"auto"}>
          <Textarea
            label="image uploads"
            disabled
            autosize
            defaultValue={
              "restaurant cover image is used for restaurant card displayed with map. The other images are used to show viewers the seating area and the outside area of the restaurant. Cover image is a required image for form submission."
            }
          />
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <FileInput
            placeholder="select .png or .jpeg"
            label="cover"
            variant={`${coverImage ? "unstyled" : "default"}`}
            withAsterisk
            value={coverImage}
            valueComponent={CustomImageButton}
            onChange={setCoverImage}
          />
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <FileInput
            multiple
            variant={`${images.length ? "unstyled" : "default"}`}
            placeholder="select .png or .jpeg"
            label="select multiple images"
            value={images}
            valueComponent={CustomImageButton}
            onChange={setImages}
          />
        </Grid.Col>
      </Grid>
      <Group position="center" mt="sm">
        <Button
          onClick={onSubmit}
          variant="outline"
          color="dark"
          size="sm"
          type="submit"
        >
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddRestaurant;
