import mongoose from "mongoose";
import { AdminSchema } from "../schemas/AdminSchema";
import { AdminInterface } from "../../interfaces/AdminInterface";
import { AdminStaticsInterface } from "../../interfaces/AdminStaticsInterface";

const Admin = mongoose.model<AdminInterface, AdminStaticsInterface>(
  "Admin",
  AdminSchema
);

export { Admin };
