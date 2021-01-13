import mongoose from "mongoose";
import { FoodCategoryInterface } from "../../interfaces/FoodCategoryInterface";
import { FoodCategorySchema } from "../schemas/FoodCategorySchema";

const FoodCategory = mongoose.model<FoodCategoryInterface>(
  "FoodCategory",
  FoodCategorySchema
);

export { FoodCategory };
