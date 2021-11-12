import { setUpDbConnection } from "../../helpers/MongooseHelper";

module.exports.up = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection('companies').createIndex(
    { name: 1 },
    { name: "nameCompanies", unique: true }
  );
  await db.collection('companies').createIndex(
    { subdomain: 1 },
    { name: "subdomainCompanies", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  const db = await setUpDbConnection();
  await db.collection('companies').dropIndex("nameCompanies");
  await db.collection('companies').dropIndex("subdomainCompanies");
  next();
};
