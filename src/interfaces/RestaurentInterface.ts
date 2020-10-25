import mongoose from "mongoose";

interface RestaurentInterface extends mongoose.Document {
  name: string;
  city: string;
  subdomain: string;
  timeZone: string;
}

export { RestaurentInterface };
