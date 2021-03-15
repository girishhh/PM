import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
// @ts-ignore
import params from "params";
import { MenuItem } from "../../db/models/MenuItemModel";
import { Menu } from "../../db/models/MenuModel";
import { Restaurent } from "../../db/models/RestaurentModel";

class MenuRoute {
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
            "menuItems",
            "restaurent"
          );
          const menuObj = new Menu(formData);
          const menu = await menuObj.save();
          if (menu) res.status(201).json(menu);
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
          const queryCondition = formData.conditions
            ? await Menu.buildQueryConditions(JSON.parse(formData.conditions))
            : {};
          const menus = await Menu.find(queryCondition)
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await Menu.countDocuments({}).exec();
          const respJson = { menuList: menus, total: totalCount };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const menu = await Menu.findById(req.params.id);
          const respJson = { menuDetails: menu };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const menu = await Menu.findOneAndDelete({
            _id: req.params.id,
          });
          if (!menu) {
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
          const formData = params(req.body).only("name", "menuItems");
          const menu = await Menu.findOneAndUpdate(
            { _id: req.params.id },
            formData,
            { new: true }
          ).exec();
          if (!menu) res.status(404).send();
          res.status(204).send();
        });
      }
    );

    this.router.put(
      "/:id/activate",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("restaurentId");
          const restaurent = await Restaurent.findOneAndUpdate(
            { _id: formData.restaurentId },
            { activeMenu: req.params.id },
            { new: true }
          ).exec();
          if (!restaurent) res.status(404).send();
          res.status(204).send();
        });
      }
    );
  };
}

export const menuRoute = new MenuRoute().router;
