import mongoose from "mongoose";

const schema = mongoose.Schema;

const PaymentChargesSchema = new schema({
  gst: { type: Number, default: 0 },
});

export { PaymentChargesSchema };
