import mongoose from "mongoose";
import { UserSchema } from "../../db/schemas/UserSchema";
import { UserInterface, UserStatics } from "../../interfaces/UserInterface";

const User = mongoose.model<UserInterface, UserStatics>("User", UserSchema);

export { User };
