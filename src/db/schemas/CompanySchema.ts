import mongoose from "mongoose";

const schema = mongoose.Schema;

const CompanySchema = new schema({
  name: String,
  city: String,
  subdomain: String,
  timeZone: String,
  users: [{ type: schema.Types.ObjectId, ref: "User" }],
});

export { CompanySchema };
