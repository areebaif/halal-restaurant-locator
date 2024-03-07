import * as React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Card, Title, TextInput, Group, Button, Text } from "@mantine/core";
import { ErrorCard, FoodTags, SearchZipcode, ImageUpload } from "@/components";
import {
  validateFormDataCreateRestaurant,
  helperListUploadImageUrl,
} from "@/utils";
import { CreateRestaurant } from "@/utils/types";

type ListForm =
  | {
      listFormData: {
        formData: FormData;
        uploadS3Url: string;
      }[];
      restaurantId: string;
      listDbImageUrl: string[];
    }
  | undefined;

export type FormFieldsErrorMessage = {
  cover?: string[];
  otherImages?: string[];
};

const AddRestaurant: React.FC = () => {
  const [name, setName] = React.useState("");
  const [latitude, setLatitude] = React.useState<string>("");
  const [longitude, setLongitude] = React.useState<string>("");
  const [foodTag, setFoodTag] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");
  const [street, setStreet] = React.useState("");
  // coverImage is separate, then rest of the images
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [images, setImages] = React.useState<File[]>([]);
  const [formFieldsErrorMessage, setFormFieldsErrorMessage] =
    React.useState<FormFieldsErrorMessage>();

  const onSubmit = async () => {
    setFormFieldsErrorMessage({});
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
      },
      otherImages: images.map((file) => ({
        type: file?.type,
        size: file?.size,
      })),
    };
    // helper to validate form data
    validateFormDataCreateRestaurant(allImages, setFormFieldsErrorMessage);

    let listForm: ListForm = undefined;

    try {
      // Before we submit the restaurant data to backend, we need to upload images to a 3rd party service.
      // helperListUploadImageUrl gets a secure urls to upload image to s3 ensuring that the image type and image size properties conform to business logic.
      // FAQ:
      // 1. Why is this function returning a restaurantId?
      //    restaurantId is used to tie images to correct restaurant and restaurant Id's are generated more securily at the api layer rather than client layer.
      // 2. Why are the actual image and setFormFieldsErrorMessage arguments to the function?
      //    This function returns form data along woth imageUrl to upload to 3rd party service. Hence the actual image is appended to the form.
      //    setFormFieldsErrorMessage is used to set any errors during validation of image type or size e.t.c.
      const listFormData = await helperListUploadImageUrl(
        allImages,
        coverImage,
        images,
        setFormFieldsErrorMessage
      );
      listForm = listFormData;
    } catch (err) {
      // at this point, no actual upload of image has taken place, hence we can return early and tell client to try again.
      setFormFieldsErrorMessage((prevState) => ({
        ...prevState,
        cover: ["something went wrong, please try again"],
      }));
      return;
    }
    if (listForm) {
      // We are not putting this in the try catch block. These are multiple images, any of the image upload can fail.
      // The backend will check if all images have upload succefully by caling the 3rd party service and querrying for image metadata.
      // If not then the api will respond appropriately, and do any necessary cleanup
      listForm.listFormData.forEach(async (form) => {
        await fetch(form.uploadS3Url, {
          method: "POST",
          body: form.formData,
        });
      });
      //result.status(204, is good)
    }

    const createRestaurantData: CreateRestaurant = {};

    // TODO: now send all the data to api to save to database.
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
      <SearchZipcode />
      <TextInput
        mt="sm"
        withAsterisk
        label="latitude"
        description="latitude range -90 to 90"
        value={latitude}
        onChange={(e) => setLatitude(e.currentTarget.value)}
      />
      <TextInput
        mt="sm"
        mb="sm"
        withAsterisk
        label="longitude"
        description="longitude range -180 to 180."
        value={longitude}
        onChange={(e) => setLongitude(e.currentTarget.value)}
      />
      <FoodTags foodTag={foodTag} setFoodTag={setFoodTag} />
      <ImageUpload
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        setImages={setImages}
        images={images}
        formFieldsErrorMessage={formFieldsErrorMessage}
      />
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
