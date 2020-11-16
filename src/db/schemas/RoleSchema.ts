import mongoose from "mongoose";

const schema = mongoose.Schema;

const RoleSchema = new schema({
  name: String,
  permissions: [String],
});

export { RoleSchema };
