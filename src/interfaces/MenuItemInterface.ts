import mongoose from "mongoose";
import { KeyValue } from "./CommonInterface";
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

export interface MenuItemStatics extends mongoose.Model<MenuItemInterface> {
  buildQueryConditions(conditions: KeyValue): Promise<KeyValue>;
}
