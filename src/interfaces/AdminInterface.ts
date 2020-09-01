import mongoose from "mongoose";
import { CompanyInterface } from "./CompanyInterface";

interface AdminInterface extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: CompanyInterface;
  isActive: boolean;
}

export { AdminInterface };
