import { setUpDbConnection } from "../../helpers/MongooseHelper";

module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("foodcategories").createIndex(
    { name: 1, company: 1 },
    { name: "nameUniqFoodCategory", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("foodcategories").dropIndex("nameUniqFoodCategory");
  next();
};
