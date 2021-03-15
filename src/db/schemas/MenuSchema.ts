import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { KeyValue } from "../../interfaces/CommonInterface";

const schema = mongoose.Schema;

const MenuSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  menuItems: [{ type: schema.Types.ObjectId, ref: "MenuItem", required: true }],
  restaurent: {
    type: schema.Types.ObjectId,
    ref: "Restaurent",
    required: true,
  },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

MenuSchema.statics.buildQueryConditions = async function (
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

attachCompanyToQuery(MenuSchema);

MenuSchema.pre("find", function () {
  this.populate("menuItems");
});

MenuSchema.pre("findOne", function () {
  this.populate("menuItems");
});

export { MenuSchema };
