import { Server } from "../../../server";
import { Restaurent } from "../models/RestaurentModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await Restaurent.collection.createIndex(
    { name: 1, company: 1 },
    { name: "nameRestaurents", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await Restaurent.collection.dropIndex("nameRestaurents");
  next();
};
