import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { PUBLIC_ROUTES } from "../constants/AuthConstants";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (
    PUBLIC_ROUTES.includes(req.path) ||
    new RegExp("^(/users/queues)").test(req.path) ||
    new RegExp("^(/api-docs)").test(req.path)
  ) {
    next();
  } else {
    passport.authenticate("jwt", { session: false })(req, res, next);
  }
};

export { authMiddleware };
