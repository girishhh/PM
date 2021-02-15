import { Server } from "../../../server";
import { MenuItem } from "../models/MenuItemModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await MenuItem.collection.createIndex(
    { name: 1, company: 1 },
    { name: "nameUniqMenuItem", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await MenuItem.collection.dropIndex("nameUniqMenuItem");
  next();
};
