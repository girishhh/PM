import mongoose from "mongoose";
import { MenuItemInterface } from "./MenuItemInterface";

export interface MenuInterface extends mongoose.Document {
  name: string;
  menuItems: MenuItemInterface[];
}
