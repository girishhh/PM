import { Server } from "../../../server";
import { Company } from "../models/CompanyModel";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
  await Company.collection.createIndex(
    { name: 1 },
    { name: "nameCompanies", unique: true }
  );
  await Company.collection.createIndex(
    { subdomain: 1 },
    { name: "subdomainCompanies", unique: true }
  );
  next();
};

module.exports.down = async function (next: any) {
  await Company.collection.dropIndex("nameCompanies");
  await Company.collection.dropIndex("subdomainCompanies");
  next();
};
