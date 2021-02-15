import mongoose from "mongoose";
import { CompanyInterface } from "./CompanyInterface";
import { FoodCategoryInterface } from "./FoodCategoryInterface";
import { MenuInterface } from "./MenuInterface";
import { RestaurentInterface } from "./RestaurentInterface";

export interface MenuItemInterface extends mongoose.Document {
  name: string;
  menus: MenuInterface[];
  categories: FoodCategoryInterface[];
  restaurent: RestaurentInterface;
  company: CompanyInterface;
}
