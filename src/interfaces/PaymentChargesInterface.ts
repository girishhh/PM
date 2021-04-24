import mongoose from "mongoose";

interface PaymentChargesInterface extends mongoose.Document {
  gst: number;
}

// interface CompanyStatics extends mongoose.Model<PaymentChargesInterface> {
//   getAdminCompany(): PaymentChargesInterface;
// }

export { PaymentChargesInterface };
