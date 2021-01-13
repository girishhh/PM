import mongoose from "mongoose";
import { AddressInterface } from "./AddressInterface";

interface RestaurentInterface extends mongoose.Document {
  name: string;
  addresses: AddressInterface[];
  company: string;
  lat: number;
  lng: number;
  geo_location_description: string;
}

export { RestaurentInterface };
