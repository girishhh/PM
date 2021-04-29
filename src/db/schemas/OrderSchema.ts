import mongoose from "mongoose";
import {
  attachCompanyToQuery,
  attachVersionIncreamentor,
} from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const OrderSchema = new schema(
  {
    grandTotal: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    restaurent: {
      type: schema.Types.ObjectId,
      ref: "Restaurent",
      required: true,
    },
    customer: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment: String,
    address: { type: schema.Types.ObjectId, ref: "Address" },
    company: { type: schema.Types.ObjectId, ref: "Company" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

OrderSchema.virtual("orderItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "order",
  justOne: false,
});

OrderSchema.pre("find", function () {
  this.populate("orderItems");
});

OrderSchema.pre("findOne", function () {
  this.populate("orderItems");
});

attachCompanyToQuery(OrderSchema);
attachVersionIncreamentor(OrderSchema);

export { OrderSchema };
