import mongoose from "mongoose";
import { RestaurentInterface } from "./RestaurentInterface";

interface RestaurentGroupInterface extends mongoose.Document {
  name: string;
  restaurents: RestaurentInterface[];
}

export { RestaurentGroupInterface };
