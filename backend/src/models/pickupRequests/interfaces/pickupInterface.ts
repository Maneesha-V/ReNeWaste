import  mongoose, { Document, Types } from "mongoose";

export interface IPickupRequest extends Document {
    userId: mongoose.Types.ObjectId;
    driverId?: mongoose.Types.ObjectId;
    wasteplantId?: mongoose.Types.ObjectId;
    addressId: mongoose.Types.ObjectId;
    wasteType: 'Residential' | 'Commercial';
    originalPickupDate: Date;
    rescheduledPickupDate?: Date;
    pickupTime: string;
    pickupId: string;
    businessName?: string;
    service?: string;
    frequency?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }
    export interface IPickupRequestDocument extends IPickupRequest, Document {
      _id: Types.ObjectId;
    }