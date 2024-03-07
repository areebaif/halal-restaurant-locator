import { ListUploadImageUrlResponseZod } from ".";
import {
  CreateFoodTag,
  ListFoodTags,
  ListGeography,
  GeoJsonRestaurantFeatureCollection,
  ListStates,
  CreateUploadImageUrl,
  ListUploadImageUrl,
  ListCountryError,
  ListStateError,
  GetZipcode,
  GetZipcodeError,
  CreateFoodTagErrors,
  ListFoodTagsError,
  ListUploadImageUrlError,
  CreateRestaurant,
  CreateRestaurantError,
  CreateRestaurantSuccess,
} from "./types";

export const listUSAGeog = async (searchTerm: string) => {
  const response = await fetch(`/api/country/usa/search=${searchTerm}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const apiErrors = /(4|5)\d{2}/.test(`${response.status}`);
  if (apiErrors) {
    const res: ListCountryError = await response.json();
    return res;
  }
  // anything other than apiErrors went wrong
  if (!response.ok) {
    throw new Error("something went wrong");
  }
  const res: ListGeography = await response.json();
  return res;
};

export const listStates = async () => {
  const response = await fetch(`/api/country/usa/states`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const apiErrors = /(4|5)\d{2}/.test(`${response.status}`);
  if (apiErrors) {
    const res: ListStateError = await response.json();
    return res;
  }
  // anything other than apiErrors went wrong
  if (!response.ok) {
    throw new Error("something went wrong");
  }
  const res: ListStates = await response.json();
  return res;
};

export const getZipcode = async (zipcode: string) => {
  const response = await fetch(`/api/country/usa/zipcode/${zipcode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const apiErrors = /(4|5)\d{2}/.test(`${response.status}`);
  if (apiErrors) {
    const res: GetZipcodeError = await response.json();
    return res;
  }
  // anything other than apiErrors went wrong
  if (!response.ok) {
    throw new Error("something went wrong");
  }
  const res: GetZipcode = await response.json();
  return res;
};

export const createFoodTag = async (data: { foodTag: string[] }) => {
  const { foodTag } = data;
  const response = await fetch(`/api/foodtags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foodTag: foodTag }),
  });

  const apiErrors = /(4|5)\d{2}/.test(`${response.status}`);
  if (apiErrors) {
    const res: CreateFoodTagErrors = await response.json();
    return res;
  }
  // anything other than apiErrors went wrong
  if (!response.ok) {
    throw new Error("something went wrong");
  }

  const res: CreateFoodTag = await response.json();
  return res;
};

export const listFoodTags = async () => {
  const response = await fetch(`/api/foodtags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const apiErrors = /(4|5)\d{2}/.test(`${response.status}`);
  if (apiErrors) {
    const res: ListFoodTagsError = await response.json();
    return res;
  }
  // anything other than apiErrors went wrong
  if (!response.ok) {
    throw new Error("something went wrong");
  }
  const res: ListFoodTags = await response.json();
  return res;
};

export const getUploadImageUrl = async (data: CreateUploadImageUrl) => {
  const response = await fetch(`/api/image:getUploadImageUrl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: data }),
  });
  const apiErrors = /(4|5)\d{2}/.test(`${response.status}`);
  if (apiErrors) {
    const res: ListUploadImageUrlError = await response.json();
    return res;
  }
  // anything other than apiErrors went wrong
  if (!response.ok) {
    throw new Error("something went wrong");
  }
  const res: ListUploadImageUrl = await response.json();
  return res;
};

export const createRestaurant = async (data: CreateRestaurant) => {
  const response = await fetch(`/api/restaurant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const apiErrors = /(4|5)\d{2}/.test(`${response.status}`);
  if (apiErrors) {
    const res: CreateRestaurantError = await response.json();
    return res;
  }
  // anything other than apiErrors went wrong
  if (!response.ok) {
    throw new Error("something went wrong");
  }

  const res: CreateRestaurantSuccess = await response.json();
  return res;
};

export const getMapSearchInput = async (data: string) => {
  const response = await fetch(`/api/restaurant/${data}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: GeoJsonRestaurantFeatureCollection = await response.json();
  return res;
};

export const helperListUploadImageUrl = async (
  allImages: CreateUploadImageUrl,
  coverImage: File,
  images: File[],
  setFormFieldsErrorMessage: React.Dispatch<
    React.SetStateAction<
      | {
          cover?: string[] | undefined;
          otherImages?: string[] | undefined;
        }
      | undefined
    >
  >
) => {
  try {
    const postSignedUrl = await getUploadImageUrl(allImages);
    const isSchemaCorrect =
      ListUploadImageUrlResponseZod.safeParse(postSignedUrl);
    if (!isSchemaCorrect.success) {
      setFormFieldsErrorMessage((prevState) => ({
        ...prevState,
        cover: ["type mismatch from server"],
      }));
      return;
    }
    // return errors
    if (postSignedUrl.hasOwnProperty("apiErrors")) {
      const errorVal = postSignedUrl as ListUploadImageUrlError;
      if (errorVal.apiErrors.validationErrors) {
        setFormFieldsErrorMessage((prevState) => ({
          ...prevState,
          cover: errorVal.apiErrors.validationErrors?.images,
        }));
      }
      if (errorVal.apiErrors.generalErrors) {
        setFormFieldsErrorMessage((prevState) => ({
          ...prevState,
          cover: errorVal.apiErrors.generalErrors,
        }));
      }
      return;
    }
    // at this point it is safe to assume we have data
    const listUrl = postSignedUrl as ListUploadImageUrl;

    const listFormData = [];
    const listDbImageUrl = [listUrl.cover.dbUrl];
    // for cover
    const formData = new FormData();
    formData.append("Content-Type", allImages.cover.type);
    Object.entries(listUrl.cover.uploadS3Fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", coverImage);
    listFormData.push({ formData, uploadS3Url: listUrl.cover.uploadS3Url });

    listUrl.otherImages?.forEach((items, index) => {
      listDbImageUrl.push(items.dbUrl);
      const formData = new FormData();
      formData.append("Content-Type", images[index].type);
      Object.entries(items.uploadS3Fields).forEach(([k, v]) => {
        formData.append(k, v);
      });
      formData.append("file", images[index]); // must be the last one
      listFormData.push({ formData, uploadS3Url: items.uploadS3Url });
    });
    return { listFormData, restaurantId: listUrl.restaurantId, listDbImageUrl };
  } catch (err) {
    setFormFieldsErrorMessage((prevState) => ({
      ...prevState,
      cover: ["something went wrong please try again"],
    }));
  }
};
