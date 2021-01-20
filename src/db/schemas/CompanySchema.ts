import mongoose from "mongoose";
import { CommonConstants } from "../../constants/CommonConstants";
import { attachAdminToCompanyQuery } from "../../helpers/MongooseHelper";
import { Company } from "../models/CompanyModel";

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

CompanySchema.statics.getAdminCompany = async function () {
  const company = await Company.findOne({
    name: CommonConstants.ADMIN_SUBDOMAIN,
    subdomain: CommonConstants.ADMIN_SUBDOMAIN,
    admin: CommonConstants.SKIP,
  });
  return company;
};

attachAdminToCompanyQuery(CompanySchema, "admin");

export { CompanySchema };
