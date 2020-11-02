import mongoose from "mongoose";

interface CompanyInterface extends mongoose.Document {
  name: string;
  city: string;
  subdomain: string;
  timeZone: string;
}

export { CompanyInterface };
