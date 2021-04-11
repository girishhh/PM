import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const CartSchema = new schema({
  subTotal: Number,
  restaurent: {
    type: schema.Types.ObjectId,
    ref: "Restaurent",
    unique: true,
    required: true,
  },
  customer: {
    type: schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(CartSchema);

export { CartSchema };
