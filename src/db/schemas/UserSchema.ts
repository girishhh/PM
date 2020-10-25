import {
  emailValidationRegex,
  passwordValidationRegex,
} from "../../constants/AuthConstants";
import { ROLES } from "../../constants/UserConstants";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = mongoose.Schema;

const UserSchema = new schema({
  firstName: String,
  lastName: String,
  city: String,
  token: String,
  subdomain: String,
  active: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    validate: {
      validator: (value: string) => emailValidationRegex.test(value),
      message: "Invalid email",
    },
    unique: true,
    required: [true, "Email field is required"],
  },
  password: {
    type: String,
    validate: {
      validator: (value: string) => passwordValidationRegex.test(value),
      message: "Invalid password",
    },
  },
  address: { type: schema.Types.ObjectId, ref: "Address" },
  roles: {
    type: [String],
    enum: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.DELIVERY_BOY],
  },
  modelId: {
    type: schema.Types.ObjectId,
    required: true,
    refPath: "modelName",
  },
  modelName: {
    type: String,
    required: true,
    enum: ["RestaurentGroup", "Restaurent"],
  },
});

UserSchema.pre("save", function (next) {
  const self: any = this;
  if (self.password) self.password = bcrypt.hashSync(self.password, 10);
  next();
});

export { UserSchema };
