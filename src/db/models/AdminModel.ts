import mongoose from "mongoose";
import { AdminSchema } from "../schemas/AdminSchema";
import { AdminInterface } from "interfaces/AdminInterface";

const Admin = mongoose.model<AdminInterface>("Admin", AdminSchema);

export { Admin };
