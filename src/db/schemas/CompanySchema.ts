import mongoose from "mongoose";
import { attachAdminToCompanyQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const CompanySchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  city: { type: String, required: [true, "City is required"] },
  subdomain: {
    type: String,
    required: [true, "Subdomain is required"],
    unique: true,
  },
  timeZone: { type: String, required: [true, "Timezone is required"] },
  admin: { type: schema.Types.ObjectId, ref: "User" },
});

attachAdminToCompanyQuery(CompanySchema, "admin");

export { CompanySchema };
