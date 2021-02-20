import mongoose from "mongoose";
import {
  MenuItemInterface,
  MenuItemStatics,
} from "../../interfaces/MenuItemInterface";
import { MenuItemSchema } from "../schemas/MenuItemSchema";

const MenuItem = mongoose.model<MenuItemInterface, MenuItemStatics>(
  "MenuItem",
  MenuItemSchema
);

export { MenuItem };
