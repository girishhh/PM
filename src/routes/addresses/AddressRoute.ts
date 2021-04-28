import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
// @ts-ignore
import params from "params";
import { Address } from "../../db/models/AddressModel";
import { buildQueryConditions } from "../../helpers/MongooseHelper";

class AddressRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.query).only(
            "start",
            "limit",
            "conditions"
          );
          const formConditions = JSON.parse(formData.conditions);
          const queryCondition = formData.conditions
            ? buildQueryConditions(formConditions)
            : {};
          const addresses = await Address.find(queryCondition)
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await Address.countDocuments({}).exec();
          const filteredAddressCount = await Address.countDocuments({
            modelName: formConditions.modelName?.$eq,
            modelId: formConditions.modelId?.$eq,
          }).exec();
          const respJson = {
            addressList: addresses,
            total: totalCount,
            filteredAddressCount,
          };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only(
            "country",
            "city",
            "state",
            "district",
            "postalCode",
            "primary",
            "modelName",
            "modelId"
          );
          const addressObj = new Address(formData);
          const foodItem = await addressObj.save();
          if (foodItem) res.status(201).send();
        });
      }
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const address = await Address.findById(req.params.id);
          if (!address) return res.status(404).send();
          const respJson = { addressDetails: address };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const address = await Address.findOneAndDelete({
            _id: req.params.id,
          });
          if (!address) {
            res.status(404).send();
            return;
          }
          res.status(204).send();
        });
      }
    );

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only(
            "country",
            "city",
            "state",
            "district",
            "postalCode",
            "primary"
          );
          const address = await Address.findById(req.params.id);
          address?.set(formData);
          const updatedAddress = await address?.save();
          if (!updatedAddress) return res.status(404).send();
          res.status(204).send();
        });
      }
    );
  };
}

export const addressRoute = new AddressRoute().router;
