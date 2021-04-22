import mongoose from "mongoose";
import httpContext from "express-http-context";
import {
  attachCompanyToQuery,
  attachVersionIncreamentor,
} from "../../helpers/MongooseHelper";
import { CART_ID } from "../../constants/CompanyConstants";

const schema = mongoose.Schema;

const CartSchema = new schema(
  {
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CartSchema.virtual("cartItems", {
  ref: "CartItem",
  localField: "_id",
  foreignField: "cart",
  justOne: false,
});

CartSchema.pre("find", function () {
  this.populate("cartItems");
});

CartSchema.pre("findOne", function () {
  this.populate("cartItems");
});

attachCompanyToQuery(CartSchema);
attachVersionIncreamentor(CartSchema);

export { CartSchema };
