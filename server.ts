import cookieParser from "cookie-parser";
import express from "express";
import http from "http";
import createError from "http-errors";
import mongoose from "mongoose";
import morgan from "morgan";
import { logger, stream } from "./src/config/LoggerConfig";
import { indexRouter } from "./src/routes";
import { ResponseError } from "./src/interfaces/CommonInterface";
import { adminRoute } from "./src/routes/admins/AdminRoute";
import { setQueues } from "bull-board";
import { emailJob } from "./src/jobs/EmailJob";
import loadash from "lodash";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Admin } from "./src/db/models/AdminModel";
import { authMiddleware } from "./src/helpers/AuthHelper";

export class Server {
  private app: express.Express;
  private port: number = Number(process.env.PORT) || 3005;

  constructor() {
    this.app = express();
    this.app.use(morgan("combined", { stream }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(authMiddleware);
  }

  setDbConnection = async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect("mongodb://localhost:27017/pm", {
          useNewUrlParser: true,
          autoIndex: false,
        });
        mongoose.set(
          "debug",
          (collection: any, method: any, query: any, doc: any) => {
            logger.info(
              `Mongoose: ${collection}.${method}(${JSON.stringify(
                query
              )}), ${JSON.stringify(doc)}`
            );
          }
        );
        logger.info("Db connection established...");
      }
    } catch (error) {
      logger.error("DB connection error: ".concat(error.message));
    }
  };

  closeDbConnection = async () => {
    try {
      await mongoose.connection.close();
      logger.info("DB Connection closed");
    } catch (error) {
      logger.error("DB connection error: ".concat(error.message));
    }
  };

  setRoutes = () => {
    this.app.use("/", indexRouter);
    this.app.use("/admins", adminRoute);
    this.app.use(function (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      const error = createError(404);
      logger.error(error.message);
      next(error);
    });
  };

  setPassportStrategy = () => {
    const opts: any = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = "secret";
    passport.use(
      new JwtStrategy(opts, async function (jwt_payload, done) {
        const admin = await Admin.findById(jwt_payload.sub);
        if (admin) return done(null, admin);
        return done(null, false);
      })
    );
  };

  setQueues = () => {
    setQueues([emailJob.emailQueue]);
  };

  setErrorHandlers = () => {
    this.app.use(
      (
        err: ResponseError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        logger.error(`${err.status}: ${err.message}`);
        res.status(err.status || 500);
        const errors = !loadash.isEmpty(err.errors)
          ? { errors: err.errors }
          : {
              message: err.message,
              error: err,
            };
        res.send(errors);
      }
    );
  };

  startServer = () => {
    var httpServer = http.createServer(this.app);
    httpServer.listen(this.port);
    httpServer.on("error", this.onError);
    httpServer.on("listening", this.onServerListen);
  };

  private onServerListen = () => {
    logger.debug("App listening on port " + this.port);
    logger.debug("you are running in " + process.env.NODE_ENV + " mode.");
  };

  private onError = (err: any) => {
    switch (err.code) {
      case "EACCES":
        logger.error("port requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        logger.error("port is already in use");
        process.exit(1);
      default:
        throw err;
    }
  };
}
