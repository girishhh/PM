import mongoose from "mongoose";

const schema = mongoose.Schema;

const UserSchema = new schema({
  firstName: String,
  lastName: String,
});

export { UserSchema };
