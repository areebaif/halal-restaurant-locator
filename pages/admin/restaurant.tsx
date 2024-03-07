import * as React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Card, Title, TextInput, Group, Button, Loader } from "@mantine/core";
import { ErrorCard, FoodTags, SearchZipcode, ImageUpload } from "@/components";
import {
  validateFormDataCreateRestaurant,
  helperListUploadImageUrl,
} from "@/utils";
import {
  CreateRestaurant,
  CreateRestaurantError,
  CreateRestaurantSuccess,
} from "@/utils/types";
import { createRestaurant } from "@/utils/crud-functions";
import { CreateRestaurantResponseZod } from "@/utils/zod/zod";

export type FormFieldsErrorMessage = {
  cover?: string[];
  otherImages?: string[];
  zipcode?: string[];
  foodTag?: string[];
  restaurantName?: string[];
  description?: string[];
  street?: string[];
  longitude?: string[];
  latitude?: string[];
};

export type Adress = {
  countryId: string;
  stateId: string;
  cityId: string;
  zipcodeId: string;
};

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

const AddRestaurant: React.FC = () => {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [latitude, setLatitude] = React.useState<string>("");
  const [longitude, setLongitude] = React.useState<string>("");
  const [foodTag, setFoodTag] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [adress, setAddress] = React.useState<Adress>({
    countryId: "",
    stateId: "",
    cityId: "",
    zipcodeId: "",
  });
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [images, setImages] = React.useState<File[]>([]);
  const [formFieldsErrorMessage, setFormFieldsErrorMessage] =
    React.useState<FormFieldsErrorMessage>();

  const mutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: (data) => {
      const result = CreateRestaurantResponseZod.safeParse(data);
      if (!result.success) {
        console.log(result.error);
        return (
          <ErrorCard message="the server responded with incorrect types, but the restaurant may have been created in the database" />
        );
      }
      if (data.hasOwnProperty("apiErrors")) {
        const apiErrors = data as CreateRestaurantError;
        if (apiErrors.apiErrors?.generalErrors) {
          return <ErrorCard message="something went wrong, please try again" />;
        }
        if (apiErrors.apiErrors?.validationErrors) {
          const errors = apiErrors.apiErrors
            ?.validationErrors as CreateRestaurantError["apiErrors"]["validationErrors"];
          const restaurantId = errors?.restaurantId;
          const countryId = errors?.countryId;
          const stateId = errors?.stateId;
          const cityId = errors?.cityId;
          const foodTag = errors?.foodTag;
          const zipcodeId = errors?.zipcodeId;
          const description = errors?.description;
          const latitude = errors?.latitude;
          const longitude = errors?.longitude;
          const cover = errors?.imageUrl;
          const restaurantName = errors?.restaurantName;
          const street = errors?.street;
          // zipcode: add all the errors
          const zipcode: string[] = [];
          if (countryId) [...zipcode, ...countryId];
          if (stateId) [...zipcode, ...stateId];
          if (cityId) [...zipcode, ...cityId];
          if (zipcodeId) [...zipcode, ...zipcodeId];
          setFormFieldsErrorMessage((prevState) => ({
            ...prevState,
            cover,
            zipcode,
            foodTag,
            restaurantName,
            description,
            longitude,
            latitude,
            street,
          }));
        }
        return;
      }
      const restaurantData = data as CreateRestaurantSuccess;
      // TODO: if we succeed with the data then navigate the user to the restaurant product page. Use the Id below
      const { restaurantId } = restaurantData;
      router.push("/");
    },
  });

  if (mutation.isLoading) {
    return <Loader />;
  }

  if (mutation.isError) {
    // TODO: this need to be a popup so that the data that the user entered is not lost and they dont have to start again
    return <ErrorCard message="something went wrong please try again" />;
  }

  const onSubmit = async () => {
    setFormFieldsErrorMessage({});
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

    const validateRestaurantData = {
      countryId: adress.countryId,
      stateId: adress.stateId,
      cityId: adress.cityId,
      zipcodeId: adress.zipcodeId,
      restaurantName: name,
      description: description,
      street: street,
      longitude: longitude,
      latitude: latitude,
      foodTag: foodTag,
    };
    // This function checks for user inputs
    // IF there are any errors then the function sets the errors and returns
    // If everything is ok, the function returns the appropriate data to send to backend except for image url which is generated by
    // 3rd party in below code.
    const restaurantData = validateFormDataCreateRestaurant(
      allImages,
      validateRestaurantData,
      setFormFieldsErrorMessage
    );
    if (!restaurantData?.data) return;

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
        restaurantData.allImages,
        coverImage!,
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
      // listForm.listFormData.forEach(async (form) => {
      //   await fetch(form.uploadS3Url, {
      //     method: "POST",
      //     body: form.formData,
      //   });
      // });
      //result.status(204, is good)
    }

    const createRestaurantData: CreateRestaurant = {
      ...restaurantData.data,
      restaurantId: listForm?.restaurantId!,
      imageUrl: listForm?.listDbImageUrl!,
    };

    mutation.mutate(createRestaurantData);
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
      {formFieldsErrorMessage?.restaurantName ? (
        <ErrorCard arrayOfErrors={formFieldsErrorMessage?.restaurantName} />
      ) : (
        <></>
      )}
      <TextInput
        mt="xs"
        withAsterisk
        label="description"
        value={description}
        placeholder="type here"
        type="text"
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      {formFieldsErrorMessage?.description ? (
        <ErrorCard arrayOfErrors={formFieldsErrorMessage?.description} />
      ) : (
        <></>
      )}
      <TextInput
        mt="xs"
        withAsterisk
        label="street"
        value={street}
        placeholder="type here"
        type="text"
        onChange={(event) => setStreet(event.currentTarget.value)}
      />
      {formFieldsErrorMessage?.street ? (
        <ErrorCard arrayOfErrors={formFieldsErrorMessage?.street} />
      ) : (
        <></>
      )}
      <SearchZipcode
        setAddress={setAddress}
        formFieldsErrorMessage={formFieldsErrorMessage}
      />
      <TextInput
        mt="sm"
        withAsterisk
        label="latitude"
        description="latitude range -90 to 90"
        value={latitude}
        onChange={(e) => setLatitude(e.currentTarget.value)}
      />
      {formFieldsErrorMessage?.latitude ? (
        <ErrorCard arrayOfErrors={formFieldsErrorMessage?.latitude} />
      ) : (
        <></>
      )}
      <TextInput
        mt="sm"
        mb="sm"
        withAsterisk
        label="longitude"
        description="longitude range -180 to 180."
        value={longitude}
        onChange={(e) => setLongitude(e.currentTarget.value)}
      />
      {formFieldsErrorMessage?.longitude ? (
        <ErrorCard arrayOfErrors={formFieldsErrorMessage?.longitude} />
      ) : (
        <></>
      )}
      <FoodTags
        foodTag={foodTag}
        setFoodTag={setFoodTag}
        formFieldsErrorMessage={formFieldsErrorMessage}
      />
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
