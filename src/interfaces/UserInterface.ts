import mongoose from "mongoose";

interface UserInterface extends mongoose.Document {
  firstName: string;
  lastName: string;
}

export { UserInterface };
