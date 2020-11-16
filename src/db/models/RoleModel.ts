import mongoose from "mongoose";
import { RoleInterface } from "../../interfaces/RoleInterface";
import { RoleSchema } from "../schemas/RoleSchema";

const Role = mongoose.model<RoleInterface>("Role", RoleSchema);

export { Role };
