import express, { Router, NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
// @ts-ignore
import params from "params";
import "express-async-errors";
import { FoodItem } from "../../db/models/FoodItemModel";

class FoodItemRoute {
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
          const queryCondition = formData.conditions
            ? await FoodItem.buildQueryConditions(
                JSON.parse(formData.conditions)
              )
            : {};
          const foodItems = await FoodItem.find(queryCondition)
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await FoodItem.countDocuments({}).exec();
          const respJson = { foodItemList: foodItems, total: totalCount };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only(
            "name",
            "type",
            "categories",
            "restaurent"
          );
          const foodItemObj = new FoodItem(formData);
          const foodItem = await foodItemObj.save();
          if (foodItem) res.status(201).send();
        });
      }
    );

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("name", "type", "categories");
          const foodItem = await FoodItem.findByIdAndUpdate(
            req.params.id,
            formData
          );
          if (foodItem) res.status(204).send();
        });
      }
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const foodItem = await FoodItem.findById(req.params.id);
          if (!foodItem) return res.status(404).send();
          const respJson = { foodItemDetails: foodItem };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const foodItem = await FoodItem.findOneAndDelete({
            _id: req.params.id,
          });
          if (!foodItem) return res.status(404).send();
          res.status(204).send();
        });
      }
    );
  };
}

export const foodItemRoute = new FoodItemRoute().router;