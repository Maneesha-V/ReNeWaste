import  mongoose, { Document, Types } from "mongoose";

export interface IPickupRequestResidential extends Document {
    userId: mongoose.Types.ObjectId;
    driverId?: mongoose.Types.ObjectId;
    wasteplantId?: mongoose.Types.ObjectId;
    addressId: mongoose.Types.ObjectId;
    wasteType: string;
    originalPickupDate: Date;
    rescheduledPickupDate?: Date;
    pickupTime: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }
    export interface IPickupRequestResidentialDocument extends IPickupRequestResidential, Document {
      _id: Types.ObjectId;
    }