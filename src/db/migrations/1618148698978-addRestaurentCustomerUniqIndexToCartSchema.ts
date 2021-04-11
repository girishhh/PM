import { Server } from "../../../server";
import { Cart } from "../models/CartModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await Cart.collection.createIndex(
    { customer: 1 },
    { name: "customerCart", unique: true }
  );
  await Cart.collection.createIndex(
    { restaurent: 1 },
    { name: "restaurentCart", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await Cart.collection.dropIndex("customerCart");
  await Cart.collection.dropIndex("restaurentCart");
  next();
};
