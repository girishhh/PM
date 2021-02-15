import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const MenuItemSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  menus: [{ type: schema.Types.ObjectId, ref: "Menu" }],
  categories: [
    {
      type: schema.Types.ObjectId,
      ref: "FoodCategory",
      required: true,
    },
  ],
  restaurent: {
    type: schema.Types.ObjectId,
    ref: "Restaurent",
    required: true,
  },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(MenuItemSchema);

export { MenuItemSchema };
