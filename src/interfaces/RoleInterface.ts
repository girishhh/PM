import mongoose from "mongoose";
export interface RoleInterface extends mongoose.Document {
  name: string;
  permissions: string[];
}
