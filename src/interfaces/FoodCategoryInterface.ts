import mongoose from "mongoose";
import { KeyValue } from "./CommonInterface";
import { CompanyInterface } from "./CompanyInterface";

interface FoodCategoryInterface extends mongoose.Document {
  name: string;
  company: CompanyInterface;
}

interface FoodCategoryStatics extends mongoose.Model<FoodCategoryInterface> {
  buildQueryConditions(conditions: KeyValue): Promise<KeyValue>;
}

export { FoodCategoryInterface, FoodCategoryStatics };
