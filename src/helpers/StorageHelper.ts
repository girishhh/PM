import { NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
import { COMPANY_ID, SUB_DOMAIN } from "../constants/CompanyConstants";
import { USER_ID } from "../constants/UserConstants";
import { Company } from "../db/models/CompanyModel";
import { CompanyInterface } from "../interfaces/CompanyInterface";
import { UserInterface } from "../interfaces/UserInterface";

export const setCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let company: CompanyInterface | null;
  const subdomain = req.header("subdomain") || "";
  if (subdomain) {
    company = await Company.findOne({ subdomain });
    httpContext.set(COMPANY_ID, company?._id.toString());
    httpContext.set(SUB_DOMAIN, subdomain);
    if (!company) {
      res.json({ message: "company or subdomain not found" }).status(404);
      return;
    }
  } else {
    res.json({ message: "company or subdomain not found" }).status(404);
    return;
  }
  next();
};

export const setCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  httpContext.set(USER_ID, (req.user as UserInterface)?._id);
  next();
};
