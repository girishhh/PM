import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { KeyValue } from "../../interfaces/CommonInterface";

const schema = mongoose.Schema;

const FoodCategorySchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(FoodCategorySchema);

FoodCategorySchema.pre("save", function () {
  const self: any = this;
  self.name = self.name.trim();
});

export { FoodCategorySchema };
