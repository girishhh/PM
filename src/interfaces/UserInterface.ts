import mongoose from "mongoose";
import { AddressInterface } from "./AddressInterface";
import { KeyValue } from "./CommonInterface";
import { CompanyInterface } from "./CompanyInterface";
import { RestaurentInterface } from "./RestaurentInterface";

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
  restaurents: RestaurentInterface[];
}

interface UserStatics extends mongoose.Model<UserInterface> {
  checkAdminExistsWithEmail(formData: UserInterface): boolean;
  duplicateOwnerForRestaurent(formData: UserInterface): boolean;
  buildQueryConditions(conditions: KeyValue): Promise<KeyValue>;
  getRoleIdsFromNames(roleNames: string[]): Promise<string[]>;
}

export { UserInterface, UserStatics };
