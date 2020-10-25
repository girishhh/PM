import { UserSchema } from "../../db/schemas/UserSchema";
import mongoose from "mongoose";
import { UserInterface } from "../../interfaces/UserInterface";

const User = mongoose.model<UserInterface>("User", UserSchema);

export { User };
