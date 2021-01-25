import mongoose from "mongoose";
import {
  FoodCategoryInterface,
  FoodCategoryStatics,
} from "../../interfaces/FoodCategoryInterface";
import { FoodCategorySchema } from "../schemas/FoodCategorySchema";

const FoodCategory = mongoose.model<FoodCategoryInterface, FoodCategoryStatics>(
  "FoodCategory",
  FoodCategorySchema
);

export { FoodCategory };
