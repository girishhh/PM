import mongoose from "mongoose";
import { MenuItemInterface } from "../../interfaces/MenuItemInterface";
import { MenuItemSchema } from "../schemas/MenuItemSchema";

const MenuItem = mongoose.model<MenuItemInterface>("MenuItem", MenuItemSchema);

export { MenuItem };
