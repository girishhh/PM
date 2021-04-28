import httpContext from "express-http-context";
import mongoose from "mongoose";
import { COMPANY_ID } from "../../constants/CompanyConstants";
import {
  attachCompanyToQuery,
  attachVersionIncreamentor,
} from "../../helpers/MongooseHelper";
import { CompanyInterface } from "../../interfaces/CompanyInterface";
import { Company } from "../models/CompanyModel";

const schema = mongoose.Schema;

const CartSchema = new schema(
  {
    grandTotal: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
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
    address: { type: schema.Types.ObjectId, ref: "Address" },
    company: { type: schema.Types.ObjectId, ref: "Company" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CartSchema.statics.getPaymentCharges = async function (
  formData: any,
  cartSubTotal: number,
  cartItemPrice: number
): Promise<{ subTotal: number; gst: number; grandTotal: number }> {
  const updatedCartItemPrice = formData.incQuantity
    ? cartItemPrice
    : -cartItemPrice;
  const company = (await Company.findById(
    httpContext.get(COMPANY_ID)
  )) as CompanyInterface;
  const gst =
    ((cartSubTotal + updatedCartItemPrice) * company.paymentCharges.gst) / 100;
  const subTotal = cartSubTotal + updatedCartItemPrice;
  const grandTotal = subTotal + gst;
  return { subTotal, gst, grandTotal };
};

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
