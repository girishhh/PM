import bson from "bson";
import { ObjectID } from "mongodb";

const sampleObjId: ObjectID = new bson.ObjectID();
const CommonConstants = {
  SKIP: sampleObjId,
  ADMIN_SUBDOMAIN: "admin",
};

const OPERATOR_MAPPING = {
  eq: "$eq",
  gt: "$gt",
  gte: "$gte",
  in: "$in",
  lt: "$lt",
  lte: "$lte",
  ne: "$ne",
  nin: "$nin",
};

export { CommonConstants, OPERATOR_MAPPING };
