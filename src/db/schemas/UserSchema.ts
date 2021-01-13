import { Response } from "express";
import mongoose from "mongoose";
import {
  EMAIL_VALIDATION_REGEXP,
  PWD_VALIDATION_REGEXP,
} from "../../constants/AuthConstants";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { RoleInterface } from "../../interfaces/RoleInterface";
import { UserInterface } from "../../interfaces/UserInterface";
import { User } from "../models/UserModel";

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
  roles: [{ type: schema.Types.ObjectId, ref: "Role" }],
  company: { type: schema.Types.ObjectId, ref: "Company" },
  restaurent: { type: schema.Types.ObjectId, ref: "Restaurent" },
});

UserSchema.virtual("permissions").get(function (this: UserInterface) {
  let permissions = [] as string[];
  for (let i = 0; i < this.roles.length; i++) {
    permissions = permissions.concat(
      ((this.roles[i] as unknown) as RoleInterface).permissions
    );
  }
  return permissions;
});

UserSchema.methods.JSON = function () {
  return { ...this.toJSON(), permissions: this.permissions };
};

attachCompanyToQuery(UserSchema);

UserSchema.pre("find", function () {
  this.populate("addresses");
});

UserSchema.pre("findOne", function () {
  this.populate("addresses");
});

export { UserSchema };
