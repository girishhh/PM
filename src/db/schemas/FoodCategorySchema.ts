import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const FoodCategorySchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(FoodCategorySchema);

export { FoodCategorySchema };
