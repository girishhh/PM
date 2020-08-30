import mongoose from "mongoose";
import { AddressSchema } from "../schemas/AddressSchema";
import { AddressInterface } from "interfaces/AddressInterface";

const Address = mongoose.model<AddressInterface>("Address", AddressSchema);

export { Address };
