import mongoose from "mongoose";

const schema = mongoose.Schema;

const RestaurentGroupSchema = new schema({
  name: { type: String, required: true },
});

export { RestaurentGroupSchema };
