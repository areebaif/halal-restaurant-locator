import {
  CreateFoodTag,
  ListFoodTags,
  ListGeography,
  GeoJsonRestaurantFeatureCollection,
  ListStates,
  ReadZipcodeDb,
  PostImageSignedUrl,
  ResponsePostSignedUrl,
  ListCountryError,
  ListStateError,
  GetZipcode,
  GetZipcodeError,
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

export const listFoodTags = async () => {
  const response = await fetch(`/api/restaurant/foodtags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ListFoodTags = await response.json();
  return res;
};

export const createFoodTag = async (data: { foodTag: string[] }) => {
  const { foodTag } = data;
  const response = await fetch(`/api/restaurant/foodtags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foodTag: foodTag }),
  });
  const res: CreateFoodTag = await response.json();
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

export const getImagePostsignedUrl = async (data: PostImageSignedUrl) => {
  const response = await fetch(`/api/upload/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: data }),
  });
  const res: ResponsePostSignedUrl = await response.json();
  return res;
};

export const getImageUrlToUploadToS3 = async (
  allImages: PostImageSignedUrl,
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
  const postSignedUrl = await getImagePostsignedUrl(allImages);
  if (postSignedUrl.coverImage || postSignedUrl.images) {
    setFormFieldsErrorMessage((prevState) => ({
      ...prevState,
      cover: postSignedUrl.coverImage,
      otherImages: postSignedUrl.images,
    }));
    return [];
  }

  const formArray = [];
  // for cover
  const formData = new FormData();
  formData.append("Content-Type", allImages.cover.type);
  Object.entries(postSignedUrl.cover!.uploadS3Fields).forEach(([k, v]) => {
    formData.append(k, v);
  });
  formData.append("file", coverImage);

  formArray.push({ formData, uploadS3Url: postSignedUrl.cover!.uploadS3Url });

  postSignedUrl.otherImages?.forEach((items, index) => {
    const formData = new FormData();
    formData.append("Content-Type", images[index].type);
    Object.entries(items.uploadS3Fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", images[index]); // must be the last one
    formArray.push({ formData, uploadS3Url: items.uploadS3Url });
  });
  return formArray;
};
