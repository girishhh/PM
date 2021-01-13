import { Server } from "../../../server";
import { FoodCategory } from "../models/FoodCategoryModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await FoodCategory.collection.createIndex(
    { name: 1, company: 1 },
    { name: "nameCompanyUniqFoodCategory", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await FoodCategory.collection.dropIndex("nameCompanyUniqFoodCategory");
  next();
};
