import { setQueues } from "bull-board";
import cookieParser from "cookie-parser";
import express, { Request as ExpressRequest } from "express";
import http from "http";
import createError from "http-errors";
import loadash from "lodash";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from "passport-jwt";
import { logger, stream } from "./src/config/LoggerConfig";
import { ROLES } from "./src/constants/UserConstants";
import { User } from "./src/db/models/UserModel";
import { authMiddleware } from "./src/helpers/AuthHelper";
import { Request, ResponseError } from "./src/interfaces/CommonInterface";
import { emailJob } from "./src/jobs/EmailJob";
import { restaurentGroupRoute } from "./src/routes/restaurent-groups/RestaurentGroupRoute";
import { restaurentRoute } from "./src/routes/restaurents/RestaurentRoute";
import { userRoute } from "./src/routes/users/UserRoute";
import CircularJSON from "circular-json";

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
        await mongoose.connect(
          "mongodb://localhost:27017,localhost:27018,localhost:27019/pm",
          {
            useNewUrlParser: true,
            autoIndex: false,
            useUnifiedTopology: true,
          }
        );
        mongoose.set(
          "debug",
          (collection: any, method: any, query: any, doc: any) => {
            logger.info(
              `Mongoose: ${collection}.${method}(${JSON.stringify(
                query
              )}), ${CircularJSON.stringify(doc)}`
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
    this.app.use("/users", userRoute);
    this.app.use("/restaurent-groups", restaurentGroupRoute);
    this.app.use("/restaurents", restaurentRoute);
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
    opts.secretOrKey = process.env.JWT_SECRET;
    opts.passReqToCallback = true;
    passport.use(
      new JwtStrategy(opts, async function (
        request: ExpressRequest,
        payload: any,
        done: VerifiedCallback
      ) {
        if (payload.roles.includes(ROLES.SUPER_ADMIN)) {
          const user = await User.findById(payload._id);
          if (user) return done(null, user.toJSON());
          return done(null, false);
        }
        const subdomain = request.header("subdomain") || "";
        (request as Request).subdomain = subdomain;
        const user = await User.findOne({ id: payload._id, subdomain });
        if (user) return done(null, user.toJSON());
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
