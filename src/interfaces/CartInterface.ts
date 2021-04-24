import mongoose from "mongoose";
import { CartItemInterface } from "./CartItemInterface";
import { CompanyInterface } from "./CompanyInterface";
import { RestaurentInterface } from "./RestaurentInterface";
import { UserInterface } from "./UserInterface";

interface CartInterface extends mongoose.Document {
  grandTotal: number;
  gst: number;
  subTotal: number;
  cartItems: CartItemInterface[];
  restaurent: RestaurentInterface | string;
  customer: UserInterface | string;
  company: CompanyInterface | string;
}

interface CartStatics extends mongoose.Model<CartInterface> {
  getPaymentCharges(
    formData: any,
    cartSubTotal: number,
    cartItemPrice: number
  ): Promise<{ subTotal: number; gst: number }>;
}

export { CartInterface, CartStatics };
