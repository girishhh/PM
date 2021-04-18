import mongoose from "mongoose";
import { CartItemInterface } from "./CartItemInterface";
import { KeyValue } from "./CommonInterface";
import { CompanyInterface } from "./CompanyInterface";
import { FoodCategoryInterface } from "./FoodCategoryInterface";
import { RestaurentInterface } from "./RestaurentInterface";

interface FoodItemInterface extends mongoose.Document {
  _id: string;
  name: string;
  type: string;
  price: number;
  categories: FoodCategoryInterface | string[];
  restaurent: RestaurentInterface;
  company: CompanyInterface;
  cartItem: CartItemInterface;
}

interface FoodItemStatics extends mongoose.Model<FoodItemInterface> {
  buildQueryConditions(conditions: KeyValue): Promise<KeyValue>;
}

export { FoodItemInterface, FoodItemStatics };
