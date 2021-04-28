import "express-async-errors";
import mongoose from "mongoose";
import {
  attachCompanyToQuery,
  attachVersionIncreamentor,
} from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const OrderItemSchema = new schema({
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  foodItem: { type: schema.Types.ObjectId, ref: "FoodItem" },
  order: { type: schema.Types.ObjectId, ref: "Order" },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(OrderItemSchema);
attachVersionIncreamentor(OrderItemSchema);

export { OrderItemSchema };
