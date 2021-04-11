import { Response } from "express";
import mongoose from "mongoose";
import { CartInterface } from "./CartInterface";
import { CompanyInterface } from "./CompanyInterface";
import { FoodItemInterface } from "./FoodItemInterface";

interface CartItemInterface extends mongoose.Document {
  price: number;
  quantity: number;
  foodItem: FoodItemInterface | string;
  cart: CartInterface | string;
  company: CompanyInterface | string;
}

interface CartItemStatics extends mongoose.Model<CartItemInterface> {
  saveCartItem(
    formData: any,
    res: Response,
    userId: string,
    cart: CartInterface | null
  ): Promise<void>;
}

export { CartItemInterface, CartItemStatics };
