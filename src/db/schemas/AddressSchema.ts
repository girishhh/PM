import mongoose from "mongoose";
const schema = mongoose.Schema;

const AddressSchema = new schema({
  country: String,
  city: String,
  state: String,
  district: String,
  postalCode: String,
  house: String,
  street: String,
  landMark: String,
  primary: {
    type: Boolean,
    default: false,
  },
  modelId: {
    type: schema.Types.ObjectId,
    required: true,
    refPath: "modelName",
  },
  modelName: {
    type: String,
    required: true,
    enum: ["Company", "User"],
  },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

export { AddressSchema };
