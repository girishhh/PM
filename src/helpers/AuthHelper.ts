import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { publicRoutes } from "../constants/AuthConstants";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (publicRoutes.includes(req.path)) {
    next();
  } else {
    passport.authenticate("jwt", { session: false })(req, res, next);
  }
};

export { authMiddleware };
