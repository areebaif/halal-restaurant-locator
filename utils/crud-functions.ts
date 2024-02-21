import {
  CreateFoodTag,
  ResponseGetAllGeogByCountry,
  GeoJsonRestaurantFeatureCollection,
  ReadCountriesDb,
  ResponseAddState,
  ReadStateDb,
  PostAddState,
  PostAddCity,
  ResponseAddCity,
  ReadCityDb,
  PostAddZipcode,
  ResponseAddZipcode,
  ReadZipcodeDb,
  ListFoodTags,
  PostImageSignedUrl,
  ResponsePostSignedUrl,
} from "./types";

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

export const postAddState = async (data: PostAddState) => {
  const response = await fetch(`/api/geography/state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res: ResponseAddState = await response.json();
  return res;
};

export const postAddCity = async (data: PostAddCity) => {
  const response = await fetch(`/api/geography/city`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res: ResponseAddCity = await response.json();
  return res;
};

export const postAddZipcode = async (data: PostAddZipcode) => {
  const response = await fetch(`/api/geography/zipcode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res: ResponseAddZipcode = await response.json();
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
// this function populates the main search page auto complete
export const getAllUSA = async () => {
  const response = await fetch(`/api/geography/country/usa`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ResponseGetAllGeogByCountry = await response.json();
  return res;
};

export const getAllCountries = async () => {
  const response = await fetch(`/api/geography/country`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadCountriesDb = await response.json();
  return res;
};

export const getStates = async () => {
  const response = await fetch(`/api/geography/state`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadStateDb = await response.json();
  return res;
};

export const getCities = async () => {
  const response = await fetch(`/api/geography/city`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadCityDb = await response.json();
  return res;
};

export const getZipcode = async () => {
  const response = await fetch(`/api/geography/zipcode`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadZipcodeDb = await response.json();
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
