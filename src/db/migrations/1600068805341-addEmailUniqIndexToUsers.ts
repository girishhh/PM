import { Server } from "../../../server";
import { User } from "../models/UserModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await User.collection.createIndex(
    { email: 1, company: 1 },
    { name: "emailCompanyUniqUsers", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await User.collection.dropIndex("emailCompanyUniqUsers");
  next();
};
