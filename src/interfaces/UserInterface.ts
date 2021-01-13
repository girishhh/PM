import { Response } from "express";
import mongoose from "mongoose";
import { AddressInterface } from "./AddressInterface";
import { CompanyInterface } from "./CompanyInterface";

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
  company: CompanyInterface;
  populatePermissions: Function;
  JSON: Function;
  permissions: string[];
}

// interface UserStatics extends mongoose.Model<UserInterface> {
//   throwIfAdminExistsForEmail(email: string, res: Response): void;
// }

export { UserInterface, UserStatics };
