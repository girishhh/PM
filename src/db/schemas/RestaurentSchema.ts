import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { KeyValue } from "../../interfaces/CommonInterface";

const schema = mongoose.Schema;

const RestaurentSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  address: { type: schema.Types.ObjectId, ref: "Address" },
  company: { type: schema.Types.ObjectId, ref: "Company" },
  lat: { type: schema.Types.Number, required: [true, "Latitude is required"] },
  lng: { type: schema.Types.Number, required: [true, "Longitude is required"] },
  geo_location_description: {
    type: String,
    required: [true, "Address text is required"],
  },
  activeMenu: { type: schema.Types.ObjectId, ref: "Menu" },
});

RestaurentSchema.statics.buildQueryConditions = async function (
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

attachCompanyToQuery(RestaurentSchema);

RestaurentSchema.pre("find", function () {
  this.populate("address");
});

RestaurentSchema.pre("findOne", function () {
  this.populate("address");
});

RestaurentSchema.pre("save", function () {
  const self: any = this;
  self.name = self.name.trim();
});

export { RestaurentSchema };
