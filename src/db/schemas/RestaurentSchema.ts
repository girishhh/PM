import mongoose, { Error } from "mongoose";
import { attachCompanyToQuery } from "../../helpers/MongooseHelper";

const schema = mongoose.Schema;

const RestaurentSchema = new schema({
  name: { type: String, required: [true, "Name is required"], unique: true },
  address: { type: schema.Types.ObjectId, ref: "Address" },
  company: { type: schema.Types.ObjectId, ref: "Company" },
  lat: {
    type: schema.Types.Number,
    required: [true, "Latitude is required"],
  },
  lng: { type: schema.Types.Number, required: [true, "Longitude is required"] },
  geo_location_description: {
    type: String,
    required: [true, "Address text is required"],
  },
  activeMenu: { type: schema.Types.ObjectId, ref: "Menu" },
  mapInfo: {
    type: Map,
    of: String,
  },
  // metaInfo: {
  //   name: {
  //     addr: {
  //       type: String,
  //       validate: {
  //         validator: function (value: any) {
  //           return false;
  //         },
  //         message: (props: any) => "check message",
  //       },
  //     },
  //   },
  // },
});

attachCompanyToQuery(RestaurentSchema);

RestaurentSchema.pre("find", function () {
  this.populate("address");
});

RestaurentSchema.pre("findOne", function () {
  this.populate("address");
});

RestaurentSchema.pre("save", function () {
  const self: any = this;
  self.name = self.name.trim();
});

export { RestaurentSchema };
