import { model } from "mongoose";
import { IRatingDocument } from "./interfaces/ratingInterface";
import { RatingSchema } from "./ratingSchema";

export const RatingModel = model<IRatingDocument>("Rating", RatingSchema )