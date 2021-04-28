import { CompanyInterface } from "./CompanyInterface";
import { FoodItemInterface } from "./FoodItemInterface";
import { OrderInterface } from "./OrderInterface";

export interface OrderItemInterface {
  price: number;
  quantity: number;
  foodItem: string | FoodItemInterface;
  order: string | OrderInterface;
  company: string | CompanyInterface;
}
