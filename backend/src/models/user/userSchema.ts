import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "./interfaces/userInterface";
import { AddressSchema } from "./addressSchema";

export const userSchema: Schema<IUserDocument> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    agreeToTerms: {
      type: Boolean,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "driver", "superadmin", "wasteplant"],
      default: "user",
    },
    phone: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,  
    },
    addresses: [AddressSchema],
    wasteplantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WastePlant',
      default: null
    }
  },
  { timestamps: true }
);
