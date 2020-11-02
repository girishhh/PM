import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {
  EMAIL_VALIDATION_REGEXP,
  PWD_VALIDATION_REGEXP,
} from "../../constants/AuthConstants";

const schema = mongoose.Schema;

const SuperAdminSchema = new schema({
  firstName: String,
  lastName: String,
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
});

SuperAdminSchema.pre("save", function (next) {
  const self: any = this;
  if (self.password) self.password = bcrypt.hashSync(self.password, 10);
  next();
});

export { SuperAdminSchema };
