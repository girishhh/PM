import mongoose from "mongoose";
import { CompanyInterface } from "../../interfaces/CompanyInterface";
import { CompanySchema } from "../schemas/CompanySchema";

const Company = mongoose.model<CompanyInterface>("Company", CompanySchema);

export { Company };
