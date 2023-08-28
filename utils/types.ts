import { z } from "zod";
import { ErrorAddFoodTagZod, PostAddFoodTagZod } from "./zod/zod";

export type ErrorAddFoodTag = z.infer<typeof ErrorAddFoodTagZod>;
export type responseAddFoodTag = z.infer<typeof PostAddFoodTagZod>;
