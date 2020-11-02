import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
// @ts-ignore
import params from "params";
import "express-async-errors";
import { Company } from "../../db/models/CompanyModel";

class CompanyRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        const formData = params(req.body).only(
          "name",
          "city",
          "subdomain",
          "timeZone"
        );
        const companyObj = new Company(formData);
        const company = await companyObj.save();
        if (company) res.status(201).json(company);
      }
    );
  };
}

export const companyRoute = new CompanyRoute().router;
