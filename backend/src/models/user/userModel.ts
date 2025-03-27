import { model } from "mongoose";
import { userSchema } from "./userSchema";
import { IUserDocument } from "./interfaces/userInterface";

export const UserModel = model<IUserDocument>("User", userSchema);