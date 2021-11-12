import { setUpDbConnection } from "../../helpers/MongooseHelper";

module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("cartitems").createIndex(
    { foodItem: 1, cart: 1 },
    { name: "foodItemCart", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("cartitems").dropIndex("foodItemCart");
  next();
};