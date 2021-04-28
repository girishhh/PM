import { Document } from "mongoose";
import { AddressInterface } from "./AddressInterface";
import { CompanyInterface } from "./CompanyInterface";
import { RestaurentInterface } from "./RestaurentInterface";
import { UserInterface } from "./UserInterface";

export interface OrderInterface extends Document {
  grandTotal: number;
  gst: number;
  subTotal: number;
  restaurent: string | RestaurentInterface;
  customer: string | UserInterface;
  address: string | AddressInterface;
  company: string | CompanyInterface;
}
