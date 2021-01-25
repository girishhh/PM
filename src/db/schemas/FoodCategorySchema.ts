import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { KeyValue } from "../../interfaces/CommonInterface";

const schema = mongoose.Schema;

const FoodCategorySchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

FoodCategorySchema.statics.buildQueryConditions = async function (
  conditions: KeyValue
): Promise<KeyValue> {
  for (let key in conditions) {
    let opearators = conditions[key];
    for (let opKey in opearators) {
      if (opKey === "contains") {
        opearators["$regex"] = new RegExp(opearators[opKey], "i");
        delete opearators[opKey];
        continue;
      }
      opearators[`$${opKey}`] = opearators[opKey];
      delete opearators[opKey];
    }
    conditions[key] = opearators;
  }
  return conditions;
};

attachCompanyToQuery(FoodCategorySchema);

FoodCategorySchema.pre("save", function () {
  const self: any = this;
  self.name = self.name.trim();
});

export { FoodCategorySchema };
