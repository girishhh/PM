import mongoose from "mongoose";
import { CompanyInterface } from "./CompanyInterface";

interface AddressInterface extends mongoose.Document {
  country: string;
  city: string;
  state: string;
  district: string;
  postalCode: string;
  house: String;
  street: String;
  landMark: String;
  primary: Boolean;
  modelId: string;
  modelName: string;
  company: CompanyInterface;
}

export { AddressInterface };
