import { Admin } from "../models/AdminModel";
import { Server } from "../../../server";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await Admin.collection.createIndex(
    { email: 1 },
    { name: "emailUniqueAdmin", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await Admin.collection.dropIndex("emailUniqueAdmin");
  next();
};
