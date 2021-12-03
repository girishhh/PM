import dotenv from "dotenv";
dotenv.config();
import { Server } from "./server";


const server = new Server();
server.setPassportStrategy();
server.setRoutes();
server.setErrorHandlers();
server.setQueues();
server.startServer();
server.setDbConnection();