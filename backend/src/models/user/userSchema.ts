import  { Schema } from "mongoose";
import { IUserDocument  } from "./interfaces/userInterface";
import { AddressSchema } from "./addressSchema";

export const userSchema: Schema<IUserDocument> = new Schema(
    {
      firstName: { 
        type: String, 
        required: true 
    },
      lastName: { 
        type: String, 
        required: true 
    },
      email: { 
        type: String, 
        required: true, 
        unique: true 
    },
      password: { 
        type: String, 
        required: true 
    },
      agreeToTerms: { 
        type: Boolean, 
        required: true 
    },
      role: { 
        type: String, 
        enum: ["user", "driver", "superadmin", "wasteplant"], 
        default: "user" 
    },
    phone: { 
      type: String, 
      required: true 
    }, 
    addresses: [AddressSchema],
    },
    { timestamps: true }
  );