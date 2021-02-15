import mongoose from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const MenuSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  menuItems: [{ type: schema.Types.ObjectId, ref: "MenuItem", required: true }],
  restaurent: {
    type: schema.Types.ObjectId,
    ref: "Restaurent",
    required: true,
  },
  company: { type: schema.Types.ObjectId, ref: "Company" },
});

attachCompanyToQuery(MenuSchema);

export { MenuSchema };
