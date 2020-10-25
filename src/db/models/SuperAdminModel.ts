import { SuperAdminInterface } from "../../interfaces/SuperAdminInterface";
import mongoose from "mongoose";
import { SuperAdminSchema } from "../schemas/SuperAdminSchema";

const SuperAdmin = mongoose.model<SuperAdminInterface>(
  "SuperAdmin",
  SuperAdminSchema
);

export { SuperAdmin };
