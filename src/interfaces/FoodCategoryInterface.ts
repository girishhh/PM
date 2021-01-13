import mongoose from "mongoose";
import { CompanyInterface } from "./CompanyInterface";

interface FoodCategoryInterface extends mongoose.Document {
  name: string;
  company: CompanyInterface;
}

export { FoodCategoryInterface };
