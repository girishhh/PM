import mongoose from "mongoose";
import {
  CompanyInterface,
  CompanyStatics,
} from "../../interfaces/CompanyInterface";
import { CompanySchema } from "../schemas/CompanySchema";

const Company = mongoose.model<CompanyInterface, CompanyStatics>(
  "Company",
  CompanySchema
);

export { Company };
