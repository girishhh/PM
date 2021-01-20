import mongoose from "mongoose";
import lodash from "lodash";
import {
  EMAIL_VALIDATION_REGEXP,
  PWD_VALIDATION_REGEXP,
} from "../../constants/AuthConstants";
import { ROLES } from "../../constants/UserConstants";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";
import { KeyValue } from "../../interfaces/CommonInterface";
import { RoleInterface } from "../../interfaces/RoleInterface";
import { UserInterface } from "../../interfaces/UserInterface";
import { Company } from "../models/CompanyModel";
import { Role } from "../models/RoleModel";
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
    validate: [
      {
        validator: (value: string) => EMAIL_VALIDATION_REGEXP.test(value),
        message: "Invalid email",
      },
    ],
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
  restaurents: [{ type: schema.Types.ObjectId, ref: "Restaurent" }],
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

UserSchema.statics.checkAdminExistsWithEmail = async function (
  formData: UserInterface
): Promise<boolean> {
  const role = await Role.findOne({ name: ROLES.ADMIN });
  const adminCompany = await Company.getAdminCompany();
  const user = await User.findOne({
    email: formData.email,
    roles: [(role?.id as unknown) as string],
    company: adminCompany.id,
  });
  return user ? true : false;
};

UserSchema.statics.duplicateOwnerForRestaurent = async function (
  formData: UserInterface
): Promise<boolean> {
  if (formData.roles.includes(ROLES.OWNER)) {
    const user = await User.findOne({
      email: formData.email,
      restaurents: [formData.restaurents[0]],
    });
    return user ? true : false;
  }
  return false;
};

UserSchema.statics.getRoleIdsFromNames = async function (roleNames: string[]) {
  const roleIds = [];
  for (let i = 0; i < roleNames.length; i++) {
    const role = await Role.findOne({ name: roleNames[i] });
    roleIds.push(role?.id);
  }
  return roleIds;
};

UserSchema.statics.buildQueryConditions = async function (
  conditions: KeyValue
): Promise<KeyValue> {
  for (let key in conditions) {
    let opearators = conditions[key];
    for (let opKey in opearators) {
      if (key === "roles") {
        const roleIds = await User.getRoleIdsFromNames(opearators[opKey]);
        opearators[opKey] = roleIds;
      }
      if (opKey === "contains") {
        opearators["$regex"] = new RegExp(opearators[opKey], "i");
        delete opearators[opKey];
        continue;
      }
      opearators[`$${opKey}`] = opearators[opKey];
      delete opearators[opKey];
    }
    conditions[key] = opearators;
  }
  return conditions;
};

attachCompanyToQuery(UserSchema);

UserSchema.pre("find", function () {
  this.populate("addresses");
});

UserSchema.pre("findOne", function () {
  this.populate("addresses");
});

export { UserSchema };
