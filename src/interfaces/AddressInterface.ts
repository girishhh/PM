import mongoose from "mongoose";

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
}

export { AddressInterface };
