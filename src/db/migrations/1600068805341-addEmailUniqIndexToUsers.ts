import { setUpDbConnection } from "../../helpers/MongooseHelper";

module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection('users').createIndex(
    { email: 1, company: 1 },
    { name: "emailCompanyUniqUsers", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection('users').dropIndex("emailCompanyUniqUsers");
  next();
};
