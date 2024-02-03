import * as React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  Card,
  Title,
  TextInput,
  Group,
  Button,
  Loader,
  Autocomplete,
  Chip,
} from "@mantine/core";
import { ErrorCard } from "@/components";
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
  const [googleUrl, setGoogleUrl] = React.useState("");
  // usually instagram, facebook links
  const [websiteLink, setWebsiteLink] = React.useState("");
  const [contactNum, setContactNum] = React.useState("");
  const [picUrl, setPicUrl] = React.useState("");
  // sset pic by restarauntId
  const [restaurantId, setRestaurantId] = React.useState("");

  // google link, website link, contact number, pictures

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
      <Group position="center" mt="sm">
        <Button variant="outline" color="dark" size="sm" type="submit">
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddRestaurant;
