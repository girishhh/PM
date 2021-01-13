import { Server } from "../../../server";
import { FoodItem } from "../models/FoodItemModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await FoodItem.collection.createIndex(
    { name: 1, restaurent: 1 },
    { name: "nameRestaurentUniqUsers", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await FoodItem.collection.dropIndex("nameRestaurentUniqUsers");
  next();
};
