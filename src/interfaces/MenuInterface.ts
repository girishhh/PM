import mongoose from "mongoose";
import { KeyValue } from "./CommonInterface";
import { MenuItemInterface } from "./MenuItemInterface";

export interface MenuInterface extends mongoose.Document {
  name: string;
  menuItems: MenuItemInterface[];
}

export interface MenuStatics extends mongoose.Model<MenuInterface> {
  buildQueryConditions(conditions: KeyValue): Promise<KeyValue>;
}
