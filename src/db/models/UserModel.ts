import mongoose from "mongoose";
import { UserSchema } from "../../db/schemas/UserSchema";
import { UserInterface } from "../../interfaces/UserInterface";

const User = mongoose.model<UserInterface>("User", UserSchema);

export { User };
