import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  EMAIL_VALIDATION_REGEXP,
  PWD_VALIDATION_REGEXP,
} from "../../constants/AuthConstants";
import { ROLES } from "../../constants/UserConstants";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const UserSchema = new schema({
  firstName: String,
  lastName: String,
  city: String,
  token: String,
  active: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    validate: {
      validator: (value: string) => EMAIL_VALIDATION_REGEXP.test(value),
      message: "Invalid email",
    },
    unique: true,
    required: [true, "Email field is required"],
  },
  password: {
    type: String,
    validate: {
      validator: (value: string) => PWD_VALIDATION_REGEXP.test(value),
      message: "Invalid password",
    },
  },
  addresses: [{ type: schema.Types.ObjectId, ref: "Address" }],
  roles: {
    type: [String],
    enum: [
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.DELIVERY_BOY,
      ROLES.CUSTOMER,
    ],
  },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(UserSchema);

export { UserSchema };
