import { setUpDbConnection } from "../../helpers/MongooseHelper";

module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("menuitems").createIndex(
    { name: 1, company: 1 },
    { name: "nameUniqMenuItem", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("menuitems").dropIndex("nameUniqMenuItem");
  next();
};