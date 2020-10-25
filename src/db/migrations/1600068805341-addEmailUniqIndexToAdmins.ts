import { Server } from "../../../server";
import { User } from "../models/UserModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await User.collection.createIndex(
    { email: 1 },
    { name: "emailUniqueAdmin", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await User.collection.dropIndex("emailUniqueAdmin");
  next();
};
