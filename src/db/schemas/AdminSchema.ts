import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {
  emailValidationRegex,
  passwordValidationRegex,
} from "../../constants/AuthConstants";

const schema = mongoose.Schema;

const AdminSchema = new schema({
  firstName: String,
  lastName: String,
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
  company: { type: schema.Types.ObjectId, ref: "Company" },
  isActive: {
    type: Boolean,
    default: false,
  },
  token: String,
});

AdminSchema.pre("save", function (next) {
  const self: any = this;
  if (self.password) self.password = bcrypt.hashSync(self.password, 10);
  next();
});

export { AdminSchema };
