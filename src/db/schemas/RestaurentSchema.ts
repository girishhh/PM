import mongoose from "mongoose";

const schema = mongoose.Schema;

const RestaurentSchema = new schema({
  name: String,
  city: String,
  subdomain: String,
  timeZone: String,
});

export { RestaurentSchema };
