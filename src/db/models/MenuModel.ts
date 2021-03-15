import mongoose from "mongoose";
import { MenuInterface, MenuStatics } from "../../interfaces/MenuInterface";
import { MenuSchema } from "../schemas/MenuSchema";

const Menu = mongoose.model<MenuInterface, MenuStatics>("Menu", MenuSchema);

export { Menu };
