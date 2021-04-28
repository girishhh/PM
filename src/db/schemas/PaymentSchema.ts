import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;
//currently we are not using this schema
const PaymentSchema = new schema(
  {
    amount: Number,
    customer: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: { type: schema.Types.ObjectId, ref: "Order" },
    company: { type: schema.Types.ObjectId, ref: "Company" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

attachCompanyToQuery(PaymentSchema);

export { PaymentSchema };
