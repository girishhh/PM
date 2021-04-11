import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const CartItemSchema = new schema({
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  foodItem: { type: schema.Types.ObjectId, ref: "FoodItem" },
  cart: { type: schema.Types.ObjectId, ref: "Cart" },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(CartItemSchema);

export { CartItemSchema };
