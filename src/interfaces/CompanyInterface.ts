import mongoose from "mongoose";
import { UserInterface } from "./UserInterface";

interface CompanyInterface extends mongoose.Document {
  name: string;
  city: string;
  subdomain: string;
  timeZone: string;
  admin: UserInterface;
}

export { CompanyInterface };
