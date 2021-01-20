import httpContext from "express-http-context";
import mongoose from "mongoose";
import { CommonConstants } from "../constants/CommonConstants";
import {
  ADMIN_DOMAIN,
  COMPANY_ID,
  SUB_DOMAIN,
} from "../constants/CompanyConstants";
import { QUERY_METHODS } from "../constants/MongooseConstants";
import { USER_ID } from "../constants/UserConstants";

export const attachCompanyToQuery = <T>(schema: mongoose.Schema) => {
  for (let i = 0; i < QUERY_METHODS.length; i++) {
    schema.pre(QUERY_METHODS[i], function () {
      const self: any = this as any;
      if (!self.company && !self._conditions?.company) {
        if (QUERY_METHODS[i] === "save") {
          self.company = httpContext.get(COMPANY_ID);
        } else {
          (this as mongoose.Query<T>).where({
            company: httpContext.get(COMPANY_ID),
          });
        }
      }
    });
  }
};

export const attachAdminToCompanyQuery = <T>(
  schema: mongoose.Schema,
  columnName: string
) => {
  for (let i = 0; i < QUERY_METHODS.length; i++) {
    schema.pre(QUERY_METHODS[i], function () {
      const subdomain = httpContext.get(SUB_DOMAIN);
      const self: any = this as any;
      if (
        self[columnName] === CommonConstants.SKIP ||
        self._conditions?.[columnName] === CommonConstants.SKIP
      ) {
        if (QUERY_METHODS[i] === "save") {
          self[columnName] = undefined;
        } else {
          (this as mongoose.Query<T>).where({
            [columnName]: undefined,
          });
        }
        return;
      }

      if (
        subdomain === ADMIN_DOMAIN &&
        !self[columnName] &&
        !self._conditions?.[columnName]
      ) {
        if (QUERY_METHODS[i] === "save") {
          self[columnName] = httpContext.get(USER_ID);
        } else {
          (this as mongoose.Query<T>).where({
            [columnName]: httpContext.get(USER_ID),
          });
        }
      }
    });
  }
};
