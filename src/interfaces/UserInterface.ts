import mongoose from "mongoose";
import { AddressInterface } from "./AddressInterface";

interface UserInterface extends mongoose.Document {
  firstName: string;
  lastName: string;
  address: AddressInterface;
  email: string;
  password: string;
  city: string;
  roles: string[];
  active: boolean;
  token: string;
  subdomain: string;
}

export { UserInterface };
