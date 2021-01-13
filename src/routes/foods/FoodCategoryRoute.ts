import express, { Router, NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
// @ts-ignore
import params from "params";
import "express-async-errors";
import { FoodCategory } from "../../db/models/FoodCategoryModel";

class FoodCategoryRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        const formData = params(req.query).only("start", "limit");
        const categories = await FoodCategory.find()
          .skip(Number(formData.start))
          .limit(Number(formData.limit));
        const totalCount = await FoodCategory.countDocuments();
        const respJson = { categoryList: categories, total: totalCount };
        res.status(200).json(respJson);
      }
    );

    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const foodCategoryObj = new FoodCategory({ name: req.body.name });
          const foodCategory = await foodCategoryObj.save();
          if (foodCategory) res.status(201).send();
        });
      }
    );

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const foodCategory = await FoodCategory.findByIdAndUpdate(
            req.params.id,
            {
              name: req.body.name,
            }
          );
          if (foodCategory) res.status(204).send();
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const foodCategory = await FoodCategory.findOneAndDelete({
            _id: req.params.id,
          });
          if (!foodCategory) return res.status(404).send();
          res.status(200).send();
        });
      }
    );
  };
}

export const foodCategoryRoute = new FoodCategoryRoute().router;
