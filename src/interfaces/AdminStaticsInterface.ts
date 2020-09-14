import { AdminInterface } from "./AdminInterface";
import { Model } from "mongoose";

interface AdminStaticsInterface extends Model<AdminInterface> {
  buildIndex: Function;
}

export { AdminStaticsInterface };
