import mongoose from "mongoose";
import { KeyValue } from "./CommonInterface";
import { CompanyInterface } from "./CompanyInterface";
import { FoodCategoryInterface } from "./FoodCategoryInterface";
import { RestaurentInterface } from "./RestaurentInterface";

interface FoodItemInterface extends mongoose.Document {
  _id: string;
  name: string;
  type: string;
  categories: FoodCategoryInterface;
  restaurent: RestaurentInterface;
  company: CompanyInterface;
}

interface FoodItemStatics extends mongoose.Model<FoodItemInterface> {
  buildQueryConditions(conditions: KeyValue): Promise<KeyValue>;
}

export { FoodItemInterface, FoodItemStatics };
