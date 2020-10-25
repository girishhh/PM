import { NextFunction, Request as ExpressReq, Response } from "express";
import passport from "passport";
import { publicRoutes } from "../constants/AuthConstants";
import { Request } from "../interfaces/CommonInterface";

const authMiddleware = (req: ExpressReq, res: Response, next: NextFunction) => {
  if (publicRoutes.includes(req.path)) {
    next();
  } else {
    passport.authenticate("jwt", { session: false })(req, res, next);
  }
};

const setDomain = (req: ExpressReq, res: Response, next: NextFunction) => {
  const subdomain = req.header("subdomain") || "";
  (req as Request).subdomain = subdomain;
  next();
};

export { authMiddleware, setDomain };
