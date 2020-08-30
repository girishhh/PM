import mongoose from "mongoose";
import { AddressInterface } from "./AddressInterface";
import { AdminInterface } from "./AdminInterface";

interface CompanyInterface extends mongoose.Document {
  name: string;
  subdomain: string;
  timeZone: string;
  address: AddressInterface;
  admins: AdminInterface[];
}

export { CompanyInterface };
