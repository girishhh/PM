import httpContext from "express-http-context";
import mongoose from "mongoose";
import { CART_ID } from "../../constants/CompanyConstants";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const FoodItemSchema = new schema(
  {
    name: { type: String, required: [true, "Name is required"], unique: true },
    type: { type: String, enum: ["veg", "nonVeg"] },
    price: { type: Number, default: 0, required: true },
    categories: [{ type: schema.Types.ObjectId, ref: "FoodCategory" }],
    restaurent: { type: schema.Types.ObjectId, ref: "Restaurent" },
    company: { type: schema.Types.ObjectId, ref: "Company" },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

attachCompanyToQuery(FoodItemSchema);

FoodItemSchema.virtual("cartItem", {
  ref: "CartItem",
  localField: "_id",
  foreignField: "foodItem",
  justOne: true,
});

FoodItemSchema.pre("find", function () {
  this.populate("categories");
  this.populate("restaurent");
  this.populate({
    path: "cartItem",
    match: { cart: httpContext.get(CART_ID) },
  });
});

FoodItemSchema.pre("findOne", function () {
  this.populate("categories");
  this.populate("restaurent");
  this.populate({
    path: "cartItem",
    match: { cart: httpContext.get(CART_ID) },
  });
});

export { FoodItemSchema };
