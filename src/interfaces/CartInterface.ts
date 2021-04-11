import mongoose from "mongoose";
import { CompanyInterface } from "./CompanyInterface";
import { RestaurentInterface } from "./RestaurentInterface";
import { UserInterface } from "./UserInterface";

interface CartInterface extends mongoose.Document {
  subTotal: Number;
  restaurent: RestaurentInterface | string;
  customer: UserInterface | string;
  company: CompanyInterface | string;
}

export { CartInterface };
