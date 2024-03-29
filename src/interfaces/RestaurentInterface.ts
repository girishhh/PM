import mongoose from "mongoose";
import { AddressInterface } from "./AddressInterface";
import { KeyValue } from "./CommonInterface";
import { MenuInterface } from "./MenuInterface";

interface RestaurentInterface extends mongoose.Document {
  name: string;
  addresses: AddressInterface[];
  company: string;
  lat: number;
  lng: number;
  geo_location_description: string;
  activeMenu: MenuInterface | string;
}

interface RestaurentStatics extends mongoose.Model<RestaurentInterface> {
  buildQueryConditions(conditions: KeyValue): Promise<KeyValue>;
}

export { RestaurentInterface, RestaurentStatics };
