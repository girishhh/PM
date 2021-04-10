import { Server } from "../../../server";
import { CartItem } from "../models/CartItemModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await CartItem.collection.createIndex(
    { foodItem: 1, cart: 1 },
    { name: "foodItemCart", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await CartItem.collection.dropIndex("foodItemCart");
  next();
};
