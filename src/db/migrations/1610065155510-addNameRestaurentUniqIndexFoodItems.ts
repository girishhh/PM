import { setUpDbConnection } from "../../helpers/MongooseHelper";


module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("fooditems").createIndex(
    { name: 1, restaurent: 1, company: 1 },
    { name: "nameRestaurentUniqUsers", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("fooditems").dropIndex("nameRestaurentUniqUsers");
  next();
};
