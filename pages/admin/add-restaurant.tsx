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
  Text,
} from "@mantine/core";
import { ErrorCard, CustomImageButton } from "@/components";
import {
  ReadZipcodeDbZod,
  getZipcode,
  getFoodTags,
  ReadFoodTagsDbZod,
  GetImagePreSignedUrlZod,
} from "@/utils";
import { getImagePresignedUrl } from "@/utils/crud-functions";

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

  const [formFieldsErrorMessage, setFormFieldsErrorMessage] = React.useState<{
    cover?: string[];
    otherImages?: string[];
  }>();

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

  const onSubmit = async () => {
    setFormFieldsErrorMessage({});
    const restaurantId = uuidv4();
    if (!coverImage) {
      setFormFieldsErrorMessage((prevState) => ({
        ...prevState,
        cover: ["you must add cover image"],
      }));
      return;
    }
    const allImages = {
      cover: {
        type: coverImage?.type,
        size: coverImage?.size,
        url: `${restaurantId}/cover/${uuidv4()}`,
      },
      otherImages: images.map((file) => ({
        type: file?.type,
        size: file?.size,
        url: `${restaurantId}/${uuidv4()}`,
      })),
    };

    const isTypeCorrent = GetImagePreSignedUrlZod.safeParse(allImages);

    if (!isTypeCorrent.success) {
      console.log(isTypeCorrent.error);
      const schemaErrors = isTypeCorrent.error.flatten().fieldErrors;
      if (schemaErrors.otherImages?.length) {
        setFormFieldsErrorMessage((prevState) => ({
          ...prevState,
          otherImages: schemaErrors.otherImages!,
        }));
      }
      if (schemaErrors.cover?.length) {
        setFormFieldsErrorMessage((prevState) => ({
          ...prevState,
          cover: schemaErrors.cover!,
        }));
      }
      return;
    }

    const postSignedUrl: {
      cover: { uploadS3Url: string; uploadS3Fields: { [key: string]: string } };
    } = await getImagePresignedUrl(allImages);

    const formData = new FormData();
    formData.append("Content-Type", coverImage.type);
    Object.entries(postSignedUrl.cover.uploadS3Fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", coverImage); // must be the last one
    // the upload is working!!!!!!
   
    try {
      const result = await fetch(postSignedUrl.cover.uploadS3Url, {
        method: "POST",
        body: formData,
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
    /*
    

Object.entries(data.fields).forEach(([k, v]) => {
	formData.append(k, v);
});
formData.append("file", file); // must be the last one
The Content-Type must be set if the POST policy contains a Condition for it.
await fetch(data.url, {
	method: "POST",
	body: formData,
});
    */

    // call your backend api for images
    // we might extract it out as separate function
    // We are handling image uploads first, then we will come back to implement submit function properly
    // we need to create a cover imageurl/ extract, size and type amnd create appropriate objects
    //
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
      {formFieldsErrorMessage?.cover ? (
        <>
          <Text>cover</Text>
          <ErrorCard arrayOfErrors={formFieldsErrorMessage?.cover} />
        </>
      ) : (
        <></>
      )}
      {formFieldsErrorMessage?.otherImages ? (
        <>
          <Text>other images</Text>
          <ErrorCard arrayOfErrors={formFieldsErrorMessage?.otherImages} />
        </>
      ) : (
        <></>
      )}
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
