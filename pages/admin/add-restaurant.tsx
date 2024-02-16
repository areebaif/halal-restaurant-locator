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
  validateAddRestaurantData,
  getImageUrlToUploadToS3,
} from "@/utils";

// TODO: This file needs to adjust now

const AddRestaurant: React.FC = () => {
  const [name, setName] = React.useState("");
  const [countryStateCityZipcode, setCountryStateCityZipcode] =
    React.useState("");
  const [latitude, setLatitude] = React.useState<string>("");
  const [longitude, setLongitude] = React.useState<string>("");
  const [foodTag, setFoodTag] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");
  const [street, setStreet] = React.useState("");
  // coverImage is separate, then rest of the images
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
    // check if user inputs are empty
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
    // check if the user sends wrong inputs and return early
    validateAddRestaurantData(allImages, setFormFieldsErrorMessage);

    // In this function we call the backend api to get secure urls (generate urls to restrict content-length, content-type) to upload to s3.
    // Additionally s3 requires formData with imageFile as last field, hence we are passing the actual image file to the function to append to form data
    // Note: The actual image file is not sent to the backend!!. We append the image file to the result of backend call
    let formArray: {
      formData: FormData;
      uploadS3Url: string;
    }[] = [];
    try {
      formArray = await getImageUrlToUploadToS3(
        allImages,
        coverImage,
        images,
        setFormFieldsErrorMessage
      );
    } catch (err) {
      // TODO: set Error that somethiong went wrong woth url creation
    }
    // once the image is uploaded to s3, we send the url to backedn to be stored in the db.
    // for any reason upload to s3 fails, the backend before saving the imageUrl to db, will call AWS Lamba, to verify if the image actually exists.
    // If the image upload fails, the backend will respond appropriately.

    if (formArray.length) {
      formArray.forEach(async (form) => {
        await fetch(form.uploadS3Url, {
          method: "POST",
          body: form.formData,
        });
      });
      // result.status(204, is good)
      //console.log(result);
    } else {
      // TODO: set Error that somethiong went wrong woth url creation
    }
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
