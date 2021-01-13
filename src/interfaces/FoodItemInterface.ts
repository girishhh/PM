import mongoose from "mongoose";
import { CompanyInterface } from "./CompanyInterface";
import { FoodCategoryInterface } from "./FoodCategoryInterface";
import { RestaurentInterface } from "./RestaurentInterface";

interface FoodItemInterface extends mongoose.Document {
  name: string;
  type: string;
  categories: FoodCategoryInterface;
  restaurent: RestaurentInterface;
  company: CompanyInterface;
}

export { FoodItemInterface };
