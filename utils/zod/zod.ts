import z from "zod";

export const ErrorAddFoodTagZod = z
  .object({
    foodTag: z.string().optional(),
  })
  .optional();

export const PostAddFoodTagZod = z.object({
  foodTag: z.string().optional(),
  name: z.string().optional(),
});
