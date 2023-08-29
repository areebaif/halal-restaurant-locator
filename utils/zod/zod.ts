import z from "zod";

export const ErrorAddFoodTagZod = z
  .object({
    foodTag: z.string().optional(),
  })
  .optional();

export const ResponseAddFoodTagZod = z.object({
  foodTag: z.string().optional(),
  id: z.string().optional(),
});

export const ResponseAddCountryZod = z.object({
  country: z.string().optional(),
  id: z.string().optional(),
});

export const ResponseAddStateZod = z.object({
  state: z.string().optional(),
  country: z.string().optional(),
  typeError: z.string().optional(),
  created: z.string().optional(),
});

export const ResponseAddCityZod = z.object({
  state: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  typeError: z.string().optional(),
  created: z.string().optional(),
});

export const ResponseAddZipcodeZod = z.object({
  state: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  typeError: z.string().optional(),
  created: z.string().optional(),
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

export const PostAddStateZod = z.object({
  countryId: z.string().uuid(),
  stateName: z.string().array(),
});

export const PostAddCityZod = z.object({
  countryId: z.string().uuid(),
  stateName: z.string(),
  cityName: z.string().array(),
});

export const PostAddZipCodeZod = z.object({
  countryId: z.string().uuid(),
  stateName: z.string(),
  cityName: z.string(),
  zipcode: z
    .object({
      longitude: z.number().gte(-180).lte(180),
      latitude: z.number().gte(-90).lte(90),
      zipcode: z.string(),
    })
    .array(),
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
