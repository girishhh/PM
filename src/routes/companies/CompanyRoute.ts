import express, { NextFunction, Request, Response, Router } from "express";
import httpContext from "express-http-context";
// @ts-ignore
import params from "params";
import "express-async-errors";
import { Company } from "../../db/models/CompanyModel";
import { User } from "../../db/models/UserModel";

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
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only(
            "name",
            "city",
            "subdomain",
            "timeZone",
            "paymentCharges"
          );
          const companyObj = new Company(formData);
          const company = await companyObj.save();
          if (company) res.status(201).json(company);
        });
      }
    );

    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.query).only("start", "limit");
          const companies = await Company.find()
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await Company.countDocuments();
          const respJson = { companyList: companies, total: totalCount };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const company = await Company.findById(req.params.id);
          const respJson = { companyDetails: company };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const company = await Company.findOneAndDelete({
            _id: req.params.id,
          });
          if (!company) {
            res.status(404).send();
            return;
          }
          await User.deleteMany({ company: company.id });

          res.status(204).send();
        });
      }
    );

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only(
            "name",
            "city",
            "subdomain",
            "timeZone",
            "users",
            "paymentCharges"
          );
          const company = await Company.findOneAndUpdate(
            { _id: req.params.id },
            formData,
            { new: true }
          ).exec();
          if (!company) res.status(404).send();
          res.status(204).send();
        });
      }
    );
  };
}

export const companyRoute = new CompanyRoute().router;
