# PM

migrate up --compiler="ts:./export-ts-node.js" --migrations-dir 'src/db/migrations'

migration file example:

import { Admin } from "../models/AdminModel";
import { Server } from "../../../server";

const server = new Server();
server.setDbConnection();

module.exports.up = async function (next: any) {
await Admin.updateMany({}, { birthDate: "03/05/1999" });
next();
};

module.exports.down = async function (next: any) {
await Admin.updateMany({}, { \$unset: { birthDate: 1 } });
next();
};
