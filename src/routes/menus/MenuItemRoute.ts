import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
// @ts-ignore
import params from "params";
import { MenuItem } from "../../db/models/MenuItemModel";

class MenuItemRoute {
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
            "categories",
            "restaurent"
          );
          const menuItemObj = new MenuItem(formData);
          const menuItem = await menuItemObj.save();
          if (menuItem) res.status(201).json(menuItem);
        });
      }
    );

    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.query).only(
            "start",
            "limit",
            "conditions"
          );
          const formDataConditions = JSON.parse(formData.conditions);
          const queryCondition = formData.conditions
            ? await MenuItem.buildQueryConditions(formDataConditions)
            : {};
          const menuItems = await MenuItem.find(queryCondition)
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await MenuItem.countDocuments({}).exec();
          const restaurentMenuItemCount = await MenuItem.countDocuments({
            restaurent: formDataConditions.restaurent.$eq,
          }).exec();
          const respJson = {
            menuItemList: menuItems,
            total: totalCount,
            restaurentMenuItemCount,
          };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const menuItem = await MenuItem.findById(req.params.id);
          const respJson = { menuItemDetails: menuItem };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const menuItem = await MenuItem.findOneAndDelete({
            _id: req.params.id,
          });
          if (!menuItem) {
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
          const formData = params(req.body).only("name", "categories");
          const menuItem = await MenuItem.findOneAndUpdate(
            { _id: req.params.id },
            formData,
            { new: true }
          ).exec();
          if (!menuItem) res.status(404).send();
          res.status(204).send();
        });
      }
    );
  };
}

export const menuItemRoute = new MenuItemRoute().router;
