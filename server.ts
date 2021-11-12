import { setQueues } from "bull-board";
import CircularJSON from "circular-json";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import express, { Request } from "express";
import httpContext from "express-http-context";
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
import { COMPANY_ID } from "./src/constants/CompanyConstants";
import { User } from "./src/db/models/UserModel";
import { authMiddleware } from "./src/helpers/AuthHelper";
import {
  setCart,
  setCompany,
  setCurrentUser,
} from "./src/helpers/StorageHelper";
import { ResponseError } from "./src/interfaces/CommonInterface";
import { emailJob } from "./src/jobs/EmailJob";
import { addressRoute } from "./src/routes/addresses/AddressRoute";
import { cartItemRoute } from "./src/routes/cart-items/CartItemRoute";
import { cartRoute } from "./src/routes/carts/CartRoute";
import { companyRoute } from "./src/routes/companies/CompanyRoute";
import { foodCategoryRoute } from "./src/routes/foods/FoodCategoryRoute";
import { foodItemRoute } from "./src/routes/foods/FoodItemRoute";
import { menuItemRoute } from "./src/routes/menus/MenuItemRoute";
import { menuRoute } from "./src/routes/menus/MenuRoute";
import { orderRoute } from "./src/routes/orders/OrderRoute";
import { restaurentRoute } from "./src/routes/restaurents/RestaurentRoute";
import { userRoute } from "./src/routes/users/UserRoute";
import swaggerUI from "swagger-ui-express";
import  swaggerDocument from './swagger.json';
import { setUpDbConnection } from "helpers/MongooseHelper";

export class Server {
  private app: express.Express;
  private port: number = Number(process.env.PORT) || 3005;

  constructor() {
    this.app = express();
    this.app.use(
      session({
        name: "cook-sess",
        secret: "secret1",
        cookie: {
          maxAge: 500000,
          path: "/",
          domain: ".localhost.com",
        },
      })
    );
    this.app.use(
      cors({
        origin: "http://test.localhost.com",
        credentials: true,
      })
    );
    this.app.use(httpContext.middleware);
    this.app.use(setCompany);
    this.app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms", {
        stream,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(authMiddleware);
    this.app.use(setCurrentUser);
  }

  setDbConnection = async () => {
    setUpDbConnection()
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(
          "mongodb://localhost:27017,localhost:27018,localhost:27019",
          {
            useNewUrlParser: true,
            autoIndex: false,
            useUnifiedTopology: true,
            dbName: "pm",
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
        mongoose.set("runValidators", true);
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
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
    this.app.use("/users", userRoute);
    this.app.use("/companies", companyRoute);
    this.app.use("/restaurents", restaurentRoute);
    this.app.use("/food-categories", foodCategoryRoute);
    this.app.use("/food-items", setCart, foodItemRoute);
    this.app.use("/menu-items", menuItemRoute);
    this.app.use("/menus", menuRoute);
    this.app.use("/carts", cartRoute);
    this.app.use("/cart-items", cartItemRoute);
    this.app.use("/addresses", addressRoute);
    this.app.use("/orders", orderRoute);
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
        request: Request,
        payload: any,
        done: VerifiedCallback
      ) {
        await httpContext.ns.runPromise(async () => {
          const user = await User.findOne({
            _id: payload._id,
            company: httpContext.get(COMPANY_ID),
          }).populate("roles");
          if (user) return done(null, user.JSON());
          return done(null, false);
        });
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
