import mongoose, { Schema } from "mongoose";
import { IRatingDocument } from "./interfaces/ratingInterface";

export const RatingSchema = new Schema<IRatingDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wasteplantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastePlant",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
