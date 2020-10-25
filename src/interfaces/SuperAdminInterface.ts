import mongoose from "mongoose";

interface SuperAdminInterface extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export { SuperAdminInterface };
