import mongoose from "mongoose";
import { FoodItemInterface } from "../../interfaces/FoodItemInterface";
import { FoodItemSchema } from "../schemas/FoodItemSchema";

const FoodItem = mongoose.model<FoodItemInterface>("FoodItem", FoodItemSchema);

export { FoodItem };
