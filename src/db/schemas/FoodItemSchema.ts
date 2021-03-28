import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { KeyValue } from "../../interfaces/CommonInterface";

const schema = mongoose.Schema;

const FoodItemSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  type: { type: String, enum: ["veg", "nonVeg"] },
  categories: [{ type: schema.Types.ObjectId, ref: "FoodCategory" }],
  restaurent: { type: schema.Types.ObjectId, ref: "Restaurent" },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

FoodItemSchema.statics.buildQueryConditions = async function (
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

attachCompanyToQuery(FoodItemSchema);

FoodItemSchema.pre("find", function () {
  this.populate("categories");
  this.populate("restaurent");
});

FoodItemSchema.pre("findOne", function () {
  this.populate("categories");
  this.populate("restaurent");
});

export { FoodItemSchema };
