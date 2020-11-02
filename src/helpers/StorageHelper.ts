import { NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
import { SUPER_ADMIN_DOMAINS } from "../constants/AuthConstants";
import { COMPANY_ID } from "../constants/CompanyConstants";
import { Company } from "../db/models/CompanyModel";
import { CompanyInterface } from "../interfaces/CompanyInterface";

export const setCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let company: CompanyInterface | null;
  const subdomain = req.header("subdomain") || "";
  if (subdomain) {
    if (SUPER_ADMIN_DOMAINS.includes(subdomain)) {
      next();
      return;
    }
    company = await Company.findOne({ subdomain });
    httpContext.set(COMPANY_ID, company?._id.toString());
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
