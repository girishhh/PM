import mongoose from "mongoose";
import { AddressSchema } from "./AddressSchema";

const schema = mongoose.Schema;

const CompanySchema = new schema({
  name: String,
  subdomain: String,
  timeZone: String,
  address: { type: schema.Types.ObjectId, ref: "Address" },
  admins: [{ type: schema.Types.ObjectId, ref: "Admin" }],
});

export { CompanySchema };
