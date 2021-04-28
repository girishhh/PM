import { Document } from "mongoose";
import { CompanyInterface } from "./CompanyInterface";
import { OrderInterface } from "./OrderInterface";
import { UserInterface } from "./UserInterface";

export interface PaymentInterface extends Document {
  amount: number;
  customer: string | UserInterface;
  order: string | OrderInterface;
  company: string | CompanyInterface;
}
