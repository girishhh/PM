import mongoose from "mongoose";
import { MenuInterface } from "../../interfaces/MenuInterface";
import { MenuSchema } from "../schemas/MenuSchema";

const Menu = mongoose.model<MenuInterface>("Menu", MenuSchema);

export { Menu };
