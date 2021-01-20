import express, { NextFunction, Request, Response, Router } from "express";
import httpContext from "express-http-context";
// @ts-ignore
import params from "params";
import mongoose from "mongoose";
import "express-async-errors";
import { USER_ID } from "../../constants/UserConstants";
import { Restaurent } from "../../db/models/RestaurentModel";
import { Address } from "../../db/models/AddressModel";

class RestaurentRoute {
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
          const restaurentFormData = params(req.body).only(
            "name",
            "address",
            "lat",
            "lng",
            "geo_location_description"
          );
          const addressFormData = restaurentFormData.address;
          restaurentFormData.created_by = httpContext.get(USER_ID);
          const restaurentObj = new Restaurent(restaurentFormData);
          const addressObj = new Address({
            ...addressFormData,
            modelName: "Restaurent",
            modelId: restaurentObj.id,
          });
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            const address = await addressObj.save({ session });
            if (address) {
              restaurentObj.set({ address: address.id });
              const restaurent = await restaurentObj.save({ session });
              if (restaurent) res.status(201).send();
            }
          });
        });
      }
    );

    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.query).only("start", "limit");
          const restaurents = await Restaurent.find()
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await Restaurent.countDocuments({}).exec();
          const respJson = { restaurentList: restaurents, total: totalCount };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const restaurent = await Restaurent.findById(req.params.id);
          if (!restaurent) return res.status(404).send();
          const respJson = { restaurentDetails: restaurent };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const restaurent = await Restaurent.findOneAndDelete({
            _id: req.params.id,
          });
          if (!restaurent) res.status(404).send();
          res.status(204).send();
        });
      }
    );

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const restaurentFormData = params(req.body).only(
            "name",
            "lat",
            "lng",
            "geo_location_description"
          );
          const addressFormData = params(req.body).only("address");
          restaurentFormData.updated_by = httpContext.get(USER_ID);
          const restaurent = await Restaurent.findById(req.params.id);
          const session = await mongoose.startSession();

          await session.withTransaction(async () => {
            if (restaurent) {
              restaurent.set(restaurentFormData);
              const address = await Address.findById(
                addressFormData.address?._id
              );
              if (address) {
                address.set(addressFormData.address);
                await address.save({ session });
                await restaurent.save({ session });
                res.status(204).send();
              } else {
                res.status(404).json({ message: "Address not found" });
              }
            } else {
              res.status(404).send();
            }
          });
        });
      }
    );
  };
}

export const restaurentRoute = new RestaurentRoute().router;
