import { Server } from "./server";
// @ts-ignore
import customEnv from "custom-env";

customEnv.env(process.env.NODE_ENV);
const server = new Server();

server.setRoutes();
server.setErrorHandlers();
server.setQueues();
server.startServer();
server.setDbConnection();
