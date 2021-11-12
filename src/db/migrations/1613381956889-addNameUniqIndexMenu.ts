import { setUpDbConnection } from "../../helpers/MongooseHelper";


module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("menus").createIndex(
    { name: 1, company: 1 },
    { name: "nameUniqMenu", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("menus").dropIndex("nameUniqMenu");
  next();
};
