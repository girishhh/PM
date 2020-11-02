import mongoose, { Model } from "mongoose";
import { QUERY_METHODS } from "../constants/MongooseConstants";
import { COMPANY_ID } from "../constants/CompanyConstants";
import httpContext from "express-http-context";

export const attachCompanyToQuery = <T>(schema: mongoose.Schema) => {
  for (let i = 0; i < QUERY_METHODS.length; i++) {
    schema.pre(QUERY_METHODS[i], function () {
      if (QUERY_METHODS[i] === "save") {
        (this as any).company = httpContext.get(COMPANY_ID);
      } else {
        (this as mongoose.Query<T>).where({
          company: httpContext.get(COMPANY_ID),
        });
      }
    });
  }
};
