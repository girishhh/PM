import mongoose from "mongoose";
import { UserInterface } from "./UserInterface";
import mongodb from "mongodb";
import { PaymentChargesInterface } from "./PaymentChargesInterface";

interface CompanyInterface extends mongoose.Document {
  name: string;
  city: string;
  subdomain: string;
  timeZone: string;
  admin: UserInterface | mongodb.ObjectID;
  paymentCharges: PaymentChargesInterface;
}

interface CompanyStatics extends mongoose.Model<CompanyInterface> {
  getAdminCompany(): CompanyInterface;
}

export { CompanyInterface, CompanyStatics };
