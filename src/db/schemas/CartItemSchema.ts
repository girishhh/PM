import { Response } from "express";
import { isEmpty } from "lodash";
import mongoose from "mongoose";
import "express-async-errors";
import {
  attachCompanyToQuery,
  attachVersionIncreamentor,
} from "../../helpers/MongooseHelper";
import { CartInterface } from "../../interfaces/CartInterface";
import { CartItem } from "../models/CartItemModel";
import { Cart } from "../models/CartModel";

const schema = mongoose.Schema;

const CartItemSchema = new schema({
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  foodItem: { type: schema.Types.ObjectId, ref: "FoodItem" },
  cart: { type: schema.Types.ObjectId, ref: "Cart" },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

CartItemSchema.statics.saveCartItem = async function (
  formData: any,
  res: Response,
  userId: string,
  cart: CartInterface | null
): Promise<void> {
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    try {
      if (!isEmpty(cart)) {
        const cartItemObj = new CartItem({ ...formData, cart: cart?.id });
        const cartItem = await cartItemObj.save({ session });
        const updatedCart = await Cart.findByIdAndUpdate(
          cartItem.cart,
          {
            $inc: { subTotal: cartItem.price },
          },
          { new: true, session }
        ).exec();

        if (updatedCart) {
          res.status(201).send();
        } else {
          await session.abortTransaction();
          res.status(422).json({ message: "Unable to save item" });
        }
      } else {
        const cartObj = new Cart({
          subTotal: formData.price,
          customer: userId,
          restaurent: formData.restaurent,
        });
        await cartObj.save({ session });
        const cartItemObj = new CartItem({
          ...formData,
          cart: cartObj.id,
        });
        const cartItem = await cartItemObj.save({ session });
        if (cartItem) res.status(201).send();
      }
    } catch (error) {
      res.status(500).send({ message: error.message, error });
    }
  });
};

CartItemSchema.pre("find", function () {
  this.populate("foodItem");
});

CartItemSchema.pre("findOne", function () {
  this.populate("foodItem");
});

attachCompanyToQuery(CartItemSchema);
attachVersionIncreamentor(CartItemSchema);

export { CartItemSchema };
