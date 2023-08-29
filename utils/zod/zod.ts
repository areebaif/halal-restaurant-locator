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

export const PostAddStateZod = z.object({
  countryId: z.string().uuid(),
  stateName: z.string().array(),
});

export const PostAddCityZod = z.object({
  countryId: z.string().uuid(),
  stateId: z.string().uuid(),
  cityName: z.string().array(),
});

export const PostAddZipCodeZod = z.object({
  countryId: z.string().uuid(),
  stateId: z.string().uuid(),
  cityId: z.string().uuid(),
  zipcode: z
    .object({
      longitude: z.number().gte(-180).lte(180),
      latitude: z.number().gte(-90).lte(90),
      zipcode: z.string(),
    })
    .array(),
});
