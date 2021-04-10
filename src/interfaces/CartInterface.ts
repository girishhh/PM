import mongoose from "mongoose";
import { CompanyInterface } from "./CompanyInterface";
import { UserInterface } from "./UserInterface";

interface CartInterface extends mongoose.Document {
  subTotal: Number;
  customer: UserInterface | string;
  company: CompanyInterface | string;
}

export { CartInterface };
