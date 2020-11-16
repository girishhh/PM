import express, { Router } from "express";

class IndexRouter {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.get("/", async (req, res, next) => {
      // const admin = await Admin.create({
      //   firstName: "girish",
      //   lastName: "kulakarni",
      //   email: "giri@gmail.com",
      //   password: "Giri1234@",
      //   // company: "s",
      // });
      res.send("Success");
    });
  };
}

export const indexRouter = new IndexRouter().router;
