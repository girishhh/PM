import { setUpDbConnection } from "../../helpers/MongooseHelper";


module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("carts").createIndex(
    { customer: 1 },
    { name: "customerCart", unique: true }
  );
  await db.collection("carts").createIndex(
    { restaurent: 1 },
    { name: "restaurentCart", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("carts").dropIndex("customerCart");
  await db.collection("carts").dropIndex("restaurentCart");
  next();
};
