import z from "zod";
// dynamic properties of objects
//z.record(z.string().uuid(), z.string().array());

export const ListCountrySchema = z.object({
  countries: z
    .object({ countryId: z.string().uuid(), countryName: z.string() })
    .array(),
});

export const ListCountryErrorSchema = z.object({
  apiErrors: z
    .object({
      generalError: z.string().array().optional(),
      queryParamError: z.string().array().optional(),
    })
    .optional(),
});
export const CreateCountryResponseSchema = z.object({
  country: z.string(),
  id: z.string(),
});

export const CreateCountryErrorSchema = z.object({
  apiErrors: z
    .object({
      generalError: z.string().array().optional(),
      validationError: z
        .object({
          country: z.string().array(),
        })
        .optional(),
    })
    .optional(),
});

export const ListStatesSchema = z
  .object({
    countryId: z.string().uuid(),
    countryName: z.string(),
    stateName: z.string(),
    stateId: z.string().uuid(),
    countryNameStateName: z.string(),
  })
  .array();

export const ListStateErrorSchema = z.object({
  apiErrors: z
    .object({
      generalError: z.string().array().optional(),
    })
    .optional(),
});

export const ListGeographySchema = z.object({
  country: z
    .object({ countryId: z.string().uuid(), countryName: z.string().uuid() })
    .optional(),
  zipcode: z
    .object({
      zipcodeId: z.string().uuid(),
      stateName: z.string(),
      cityName: z.string(),
      zipcode: z.string(),
      latitude: z.number().gte(-90).lte(90),
      longitude: z.number().gte(-180).lte(180),
    })
    .array()
    .optional(),
  state: z
    .object({ stateId: z.string().uuid(), stateName: z.string() })
    .array()
    .optional(),
  city: z
    .object({
      cityId: z.string().uuid(),
      stateName: z.string(),
      cityName: z.string(),
    })
    .array()
    .optional(),
});

export const GetZipcodeZod = z.object({
  zipcode: z.object({
    zipcodeId: z.string().uuid(),
    zipcode: z.string(),
    cityId: z.string().uuid(),
    stateId: z.string().uuid(),
    stateName: z.string(),
    cityName: z.string(),
    latitude: z.number().gte(-90).lte(90),
    longitude: z.number().gte(-180).lte(180),
    countryId: z.string().uuid(),
    countryName: z.string(),
  }),
});

export const GetZipcodeErrorZod = z.object({
  apiErrors: z
    .object({
      validationErrors: z
        .object({
          zipcode: z.string().array(),
        })
        .optional(),
      generalError: z.string().array().optional(),
    })
    .optional(),
});
export const GetZipCodeResponseZod = z.union([
  GetZipcodeErrorZod,
  GetZipcodeZod,
]);

export const ListFoodTagsErrorZod = z.object({
  apiErrors: z
    .object({
      generalErrors: z.string().array().optional(),
    })
    .optional(),
});

export const ListFoodTagsZod = z
  .object({ name: z.string(), foodTagId: z.string().uuid() })
  .array();

export const ListFoodTagsResponseZod = z.union([
  ListFoodTagsZod,
  ListFoodTagsErrorZod,
]);

export const CreateFoodTagErrorsZod = z.object({
  apiErrors: z
    .object({
      validationErrors: z
        .object({
          foodTag: z.string().array(),
        })
        .optional(),
      generalErrors: z.string().array().optional(),
    })
    .optional(),
});
export const CreateFoodTagZod = z.object({
  created: z.boolean(),
});

export const CreateFoodTagResponseZod = z.union([
  CreateFoodTagErrorsZod,
  CreateFoodTagZod,
]);

export const CreateUploadImageUrlZod = z.object({
  cover: z.object({
    type: z
      .string()
      .min(1, { message: "no image provided, cover image is required" })
      .regex(new RegExp(/image\/(jpg|jpeg|png)$/), {
        message: "image must be of type jpg, or jpeg or png",
      }),
    size: z.number().lt(5000000, { message: " maximum filesize 5mb" }),
    // url: z
    //   .string()
    //   .includes("cover", { message: "must include cover in the url" }),
  }),
  otherImages: z
    .object({
      type: z.string().regex(new RegExp(/image\/(jpg|jpeg|png)$/), {
        message: "image must be of type jpg, or jpeg or png",
      }),
      size: z.number().lt(5000000, { message: " maximum filesize 5mb" }),
      // url: z.string(),
    })
    .optional()
    .array(),
});

export const ListUploadImageUrlZod = z.object({
  restaurantId: z.string().uuid(),
  cover: z.object({
    uploadS3Url: z.string(),
    uploadS3Fields: z.record(z.string()),
    type: z.string(),
    dbUrl: z.string(),
  }),
  otherImages: z
    .object({
      uploadS3Url: z.string(),
      uploadS3Fields: z.record(z.string()),
      type: z.string(),
      dbUrl: z.string(),
    })
    .array()
    .optional(),
});

export const ListUploadImageUrlErrorZod = z.object({
  apiErrors: z.object({
    validationErrors: z
      .object({
        images: z.string().array(),
      })
      .optional(),
    generalErrors: z.string().array().optional(),
  }),
});

export const ListUploadImageUrlResponseZod = z.union([
  ListUploadImageUrlErrorZod,
  ListUploadImageUrlZod,
]);

export const CreateRestaurantZod = z.object({
  restaurantName: z
    .string()
    .min(1, { message: "please provide a value as string" }),
  description: z
    .string()
    .min(1, { message: "please provide a value as string" }),
  street: z.string().min(1, { message: "please provide a value as string" }),
  imageUrl: z.string().array(),
  countryId: z
    .string()
    .uuid({ message: "please provide a valid uuid as string" }),
  stateId: z
    .string()
    .uuid({ message: "please provide a valid uuid as string" }),
  cityId: z.string().uuid({ message: "please provide a valid uuid as string" }),
  zipcodeId: z
    .string()
    .uuid({ message: "please provide a valid uuid as string" }),

  longitude: z.number().gte(-180).lte(180, {
    message: "please provide a valid longitude as float between -180 and 180 ",
  }),
  latitude: z.number().gte(-90).lte(90, {
    message: "please provide a valid latitude as float between -90 and 90",
  }),
  foodTag: z
    .string()
    .uuid({ message: "please provide a valid uuid as string" })
    .array(),
  restaurantId: z
    .string()
    .uuid({ message: "please provide a valid uuid as string" }),
});

export const GetRestaurantErrorZod = z.object({
  apiErrors: z
    .object({
      validationErrors: z
        .object({
          restaurantId: z.string().array(),
        })
        .optional(),
      generalError: z.string().array().optional(),
    })
    .optional(),
});

export const GetRestaurantZod = z.object({
  restaurantId: z.string().uuid(),
  restaurantName: z.string(),
  description: z.string(),
  street: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  zipcode: z.string(),
  FoodTag: z.string().array(),
  imageUrl: z.string().array(),
});

export const CreateRestaurantSuccessZod = z.object({
  created: z.boolean(),
  restaurantId: z.string().uuid(),
});

export const CreateRestaurantErrorZod = z.object({
  apiErrors: z.object({
    validationErrors: z
      .object({
        restaurantId: z.string().array().optional(),
        countryId: z.string().array().optional(),
        stateId: z.string().array().optional(),
        cityId: z.string().array().optional(),
        foodTag: z.string().array().optional(),
        description: z.string().array().optional(),
        street: z.string().array().optional(),
        latitude: z.string().array().optional(),
        longitude: z.string().array().optional(),
        imageUrl: z.string().array().optional(),
        zipcodeId: z.string().array().optional(),
        restaurantName: z.string().array().optional(),
      })
      .optional(),
    generalErrors: z.string().array().optional(),
  }),
});

export const CreateRestaurantResponseZod = z.union([
  CreateRestaurantSuccessZod,
  CreateRestaurantErrorZod,
]);

export const FilterRestaurantsByZipcodeZod = z.object({
  country: z.string(),
  zipcode: z.string(),
});

export const FilterRestaurantsByCityZod = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
});

export const FilterRestaurantsErrorsZod = z.object({
  apiErrors: z
    .object({
      validationErrors: z
        .object({
          zipcode: z.string().array().optional(),
          country: z.string().array().optional(),
          state: z.string().array().optional(),
          city: z.string().array().optional(),
        })
        .optional(),
      generalErrors: z.string().array().optional(),
    })
    .optional(),
});

export const GeoJsonPropertiesRestaurantZod = z.object({
  restaurantId: z.string().uuid(),
  restaurantName: z.string(),
  description: z.string(),
  street: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  zipcode: z.string(),
  FoodTag: z.string().array(),
  imageUrl: z.string().array(),
});

export const GeoJsonFeatureRestaurantZod = z
  .object({
    id: z.number(),
    type: z.string().refine((val) => val === "Feature"),
    geometry: z.object({
      type: z.string().refine((val) => val === "Point"),
      coordinates: z.number().gte(-180).lte(180).array().length(2),
    }),
    properties: GeoJsonPropertiesRestaurantZod,
  })
  .array();

export const GeoJsonFeatureCollectionRestaurantsZod = z.object({
  restaurants: z
    .object({
      type: z.string().refine((val) => val === "FeatureCollection"),
      features: GeoJsonFeatureRestaurantZod,
    })
    .optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  typeError: z.string().optional(),
  restaurantError: z.string().optional(),
});

export const FilterRestaurantResponseZod = z.union([
  GeoJsonFeatureCollectionRestaurantsZod,
  FilterRestaurantsErrorsZod,
]);

export const ListRestaurantsZod = z.object({
  restaurants: z
    .object({
      restaurantId: z.string().uuid(),
      latitude: z.number().gte(-90).lte(90),
      longitude: z.number().gte(-180).lte(180),
      restaurantName: z.string(),
      description: z.string(),
      country: z.string(),
      state: z.string(),
      city: z.string(),
      zipcode: z.string(),
      street: z.string(),
      FoodTag: z.string().array(),
      imageUrl: z.string().array(),
    })
    .array(),
});
