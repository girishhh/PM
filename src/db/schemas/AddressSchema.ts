import mongoose from "mongoose";
const schema = mongoose.Schema;

const AddressSchema = new schema({
  country: String,
  city: String,
  state: String,
  district: String,
  postalCode: String,
  address: String,
  secondaryAddress: String,
  companyId: String,
  modelId: {
    type: schema.Types.ObjectId,
    required: true,
    refPath: "modelName",
  },
  modelName: {
    type: String,
    required: true,
    enum: ["Company"],
  },
});

export { AddressSchema };
