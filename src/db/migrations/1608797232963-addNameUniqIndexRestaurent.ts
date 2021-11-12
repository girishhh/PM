import { setUpDbConnection } from "../../helpers/MongooseHelper";


module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("restaurents").createIndex(
    { name: 1, company: 1 },
    { name: "nameRestaurents", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection("restaurents").dropIndex("nameRestaurents");
  next();
};
