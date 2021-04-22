import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
import lodash from "lodash";
// @ts-ignore
import params from "params";
import { COMPANY_ID } from "../../constants/CompanyConstants";
import { FoodItem } from "../../db/models/FoodItemModel";
import { Restaurent } from "../../db/models/RestaurentModel";
import { buildQueryConditions } from "../../helpers/MongooseHelper";
import { MenuInterface } from "../../interfaces/MenuInterface";

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
          const formConditions = JSON.parse(formData.conditions);
          const queryCondition = formData.conditions
            ? buildQueryConditions(formConditions)
            : {};
          const foodItems = await FoodItem.find(queryCondition)
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await FoodItem.countDocuments({}).exec();
          const filteredDocumentCount = await FoodItem.countDocuments(
            queryCondition
          ).exec();
          const respJson = {
            foodItemList: foodItems,
            total: totalCount,
            filteredDocumentCount,
          };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.get(
      "/dashboardSearch",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.query).only(
            "start",
            "limit",
            "searchText"
          );
          const companyRestaurents = await Restaurent.find({
            company: httpContext.get(COMPANY_ID),
          })
            .where("activeMenu")
            .ne(null)
            .populate("activeMenu")
            .exec();

          let foodCategoryIds: string[] = [];
          companyRestaurents.map((restaurent) => {
            (restaurent.activeMenu as MenuInterface).menuItems.map(
              (menuItem) =>
                (foodCategoryIds = foodCategoryIds.concat(
                  menuItem.categories.map((cat) => cat._id)
                ))
            );
          });

          const foodItems = await FoodItem.find({
            $and: [
              { name: { $regex: new RegExp(formData.searchText, "i") } },
              { categories: { $in: foodCategoryIds } },
            ],
          }).exec();

          const foodItemRestaurents = foodItems.map((item) => item.restaurent);
          const queryConditions = buildQueryConditions({
            name: { contains: formData.searchText },
          });
          const restaurents = await Restaurent.find(queryConditions).exec();
          const allRestaurents = foodItemRestaurents.concat(restaurents);
          const finalRestaurents = lodash.uniqBy(allRestaurents, "_id");
          res.status(200).json({ restaurents: finalRestaurents });
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
            "price",
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
          const formData = params(req.body).only(
            "name",
            "type",
            "price",
            "categories"
          );
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
