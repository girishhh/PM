import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { KeyValue } from "../../interfaces/CommonInterface";

const schema = mongoose.Schema;

const MenuItemSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  menus: [{ type: schema.Types.ObjectId, ref: "Menu" }],
  categories: [
    {
      type: schema.Types.ObjectId,
      ref: "FoodCategory",
      required: true,
    },
  ],
  restaurent: {
    type: schema.Types.ObjectId,
    ref: "Restaurent",
    required: true,
  },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

MenuItemSchema.statics.buildQueryConditions = async function (
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

attachCompanyToQuery(MenuItemSchema);

MenuItemSchema.pre("find", function () {
  this.populate("categories");
});

MenuItemSchema.pre("findOne", function () {
  this.populate("categories");
});

export { MenuItemSchema };
