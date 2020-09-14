import { logger } from "config/LoggerConfig";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { noAuthRequiredRoutes } from "../constants/AuthConstants";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (noAuthRequiredRoutes.includes(req.path)) {
    next();
  } else {
    passport.authenticate("jwt", { session: false })(req, res, next);
  }
};

export { authMiddleware };
