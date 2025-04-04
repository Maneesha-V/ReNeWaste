import  { Schema } from "mongoose";
import { IWastePlantDocument } from "./interfaces/wastePlantInterface";

export const wastePlantSchema: Schema<IWastePlantDocument> = new Schema({
    plantName: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    contactInfo: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { 
      type: String, 
      required: true,
      unique: true,
    },
    licenseNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Active', 'Inactive', 'Rejected'],
      default: 'Pending'
    },
    licenseDocumentPath: { type: String, required: true },
    subscriptionPlan: { 
      type: String,
      enum: ['Basic','Premium', 'Pro'],
      default: 'Basic'
     },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

