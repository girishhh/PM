import express, { Router } from "express";
import { Admin } from "../../db/models/AdminModel";
import "express-async-errors";

class AdminRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.put("/create-password", async (req, res, next) => {
      const { token, password } = req.body;
      let admin = await Admin.findOne({ token, isActive: false });
      if (admin) {
        admin.set({ password, isActive: true });
        admin = await admin.save();
      } else {
        res.status(404).send();
      }
      res.status(200).send(admin?.toJSON());
    });
  };
}

export const adminRoute = new AdminRoute().router;
