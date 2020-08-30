import mongoose from "mongoose";

interface AddressInterface extends mongoose.Document {
  country: string;
  city: string;
  state: string;
  district: string;
  postalCode: string;
  address: string;
  secondaryAddress: string;
  companyId: string;
  modelId: string;
  modelName: string;
}

export { AddressInterface };
