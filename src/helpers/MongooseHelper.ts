import CircularJSON from "circular-json";
import { logger } from "../config/LoggerConfig";
import httpContext from "express-http-context";
import mongoose from "mongoose";
import { CommonConstants } from "../constants/CommonConstants";
import {
  ADMIN_DOMAIN,
  COMPANY_ID,
  SUB_DOMAIN
} from "../constants/CompanyConstants";
import {
  QUERY_METHODS,
  UPDATE_QUERY_METHODS
} from "../constants/MongooseConstants";
import { USER_ID } from "../constants/UserConstants";
import { KeyValue } from "../interfaces/CommonInterface";

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

export const buildQueryConditions = function (conditions: KeyValue): KeyValue {
  for (let key in conditions) {
    let opearators = conditions[key];
    for (let opKey in opearators) {
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

export const attachVersionIncreamentor = (schema: mongoose.Schema): void => {
  for (let i = 0; i < UPDATE_QUERY_METHODS.length; i++) {
    schema.pre(UPDATE_QUERY_METHODS[i], function () {
      const self = this as any;
      self.update({}, { $inc: { __v: 1 } });
    });
  }
};


export const setUpDbConnection = async ():  Promise<any> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        "mongodb://localhost:27017,localhost:27018,localhost:27019",
        {
          useNewUrlParser: true,
          autoIndex: false,
          useUnifiedTopology: true,
          dbName: "pm",
        }
      );      
      mongoose.set(
        "debug",
        (collection: any, method: any, query: any, doc: any) => {
          logger.info(
            `Mongoose: ${collection}.${method}(${JSON.stringify(
              query
            )}), ${CircularJSON.stringify(doc)}`
          );
        }
      );
      mongoose.set("runValidators", true);
      logger.info("Db connection established...");      
    }
    return mongoose.connection.db
  } catch (error) {
    //@ts-ignore
    logger.error("DB connection error: ".concat(error.message));
  }
}
