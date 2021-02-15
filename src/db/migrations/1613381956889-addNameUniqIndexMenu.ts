import { Server } from "../../../server";
import { Menu } from "../models/MenuModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await Menu.collection.createIndex(
    { name: 1, company: 1 },
    { name: "nameUniqMenu", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await Menu.collection.dropIndex("nameUniqMenu");
  next();
};
