import mongoose from "mongoose";
import { CompanySchema } from "../schemas/CompanySchema";
import { CompanyInterface } from "interfaces/CompanyInterface";

const Company = mongoose.model<CompanyInterface>("Company", CompanySchema);

export { Company };
