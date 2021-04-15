import mongoose from "mongoose";
import { CartItemInterface } from "./CartItemInterface";
import { CompanyInterface } from "./CompanyInterface";
import { RestaurentInterface } from "./RestaurentInterface";
import { UserInterface } from "./UserInterface";

interface CartInterface extends mongoose.Document {
  subTotal: Number;
  cartItems: CartItemInterface[];
  restaurent: RestaurentInterface | string;
  customer: UserInterface | string;
  company: CompanyInterface | string;
}

export { CartInterface };
