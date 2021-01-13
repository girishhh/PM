import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const FoodItemSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  type: { type: String, enum: ["veg", "nonVeg"] },
  categories: [{ type: schema.Types.ObjectId, ref: "FoodCategory" }],
  restaurent: { type: schema.Types.ObjectId, ref: "Restaurent" },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(FoodItemSchema);

export { FoodItemSchema };
