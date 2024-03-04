import z from "zod";
// dynamic properties of objects
//z.record(z.string().uuid(), z.string().array());

export const ListCountryZod = z.object({
  countries: z
    .object({ countryId: z.string().uuid(), countryName: z.string() })
    .array(),
});

export const listCountryErrorZod = z.object({
  apiErrors: z
    .object({
      generalError: z.string().array().optional(),
      queryParamError: z.string().array().optional(),
    })
    .optional(),
});
export const CreateCountryResponseZod = z.object({
  country: z.string(),
  id: z.string(),
});

export const CreateCountryErrorZod = z.object({
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

export const ListStatesZod = z
  .object({
    countryId: z.string().uuid(),
    countryName: z.string(),
    stateName: z.string(),
    stateId: z.string().uuid(),
    countryNameStateName: z.string(),
  })
  .array();

export const ListStateErrorZod = z.object({
  apiErrors: z
    .object({
      generalError: z.string().array().optional(),
    })
    .optional(),
});

export const ListGeographyZod = z.object({
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

export const ListFoodTagsZod = z
  .object({ name: z.string(), foodTagId: z.string().uuid() })
  .array();

export const CreateFoodTagZod = z.object({
  created: z.boolean(),
  errors: z
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



export const ResponseAddRestaurantZod = z.object({
  state: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  restaurant: z.string().optional(),
  foodTag: z.string().optional(),
  typeError: z.string().optional(),
  created: z.string().optional(),
});


export const PostAddRestaurantZod = z.object({
  countryId: z.string().uuid(),
  street: z.string(),
  stateName: z.string(),
  cityName: z.string(),
  zipcode: z.string(),
  restaurantName: z.string(),
  description: z.string(),
  longitude: z.number().gte(-180).lte(180),
  latitude: z.number().gte(-90).lte(90),
  foodTag: z.string().uuid().array(),
});

export const GetSearchInputsZod = z.object({
  state: z.string(),
  city: z.string(),
  zipcode: z.string(),
  country: z.string(),
  restaurantName: z.string(),
});

export const GeoJsonRestaurantPropertiesZod = z.object({
  restaurantId: z.string().uuid(),
  restaurantName: z.string(),
  description: z.string(),
  street: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  zipcode: z.string(),
  FoodTag: z.string().array(),
});

export const RestaurantGeoJsonFeatureZod = z
  .object({
    id: z.number(),
    type: z.string().refine((val) => val === "Feature"),
    geometry: z.object({
      type: z.string().refine((val) => val === "Point"),
      coordinates: z.number().gte(-180).lte(180).array().length(2),
    }),
    properties: GeoJsonRestaurantPropertiesZod,
  })
  .array();

export const ResponseRestaurantGeoJsonZod = z.object({
  restaurants: z
    .object({
      type: z.string().refine((val) => val === "FeatureCollection"),
      features: RestaurantGeoJsonFeatureZod,
    })
    .optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  typeError: z.string().optional(),
  restaurantError: z.string().optional(),
});

export const RestaurantReadDbZod = z.object({
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
    })
    .array(),
});

export const ReadZipcodeDbZod = z
  .object({
    countryId: z.string().uuid(),
    countryName: z.string(),
    stateName: z.string(),
    stateId: z.string().uuid(),
    cityId: z.string().uuid(),
    cityName: z.string(),
    countryStateCityZipcode: z.string(),
    zipcodeId: z.string().uuid(),
    zipcode: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .array();

export const PostImageSignedUrlZod = z.object({
  cover: z.object({
    type: z.string().regex(new RegExp(/image\/(jpg|jpeg|png)$/), {
      message: "image must be of type jpg, or jpeg or png",
    }),
    size: z.number().lt(5000000, { message: " maximum filesize 5mb" }),
    url: z
      .string()
      .includes("cover", { message: "must include cover in the url" }),
  }),
  otherImages: z
    .object({
      type: z.string().regex(new RegExp(/image\/(jpg|jpeg|png)$/), {
        message: "image must be of type jpg, or jpeg or png",
      }),
      size: z.number().lt(5000000, { message: " maximum filesize 5mb" }),
      url: z.string(),
    })
    .optional()
    .array(),
});

export const ResponsePostSignedUrlZod = z.object({
  cover: z
    .object({
      uploadS3Url: z.string(),
      uploadS3Fields: z.record(z.string()),
      type: z.string(),
      dbUrl: z.string(),
    })
    .optional(),
  otherImages: z
    .object({
      uploadS3Url: z.string(),
      uploadS3Fields: z.record(z.string()),
      type: z.string(),
      dbUrl: z.string(),
    })
    .array()
    .optional(),
  coverImage: z.string().array().optional(),
  images: z.string().array().optional(),
});
