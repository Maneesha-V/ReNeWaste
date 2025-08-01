import  mongoose, { Document, Types } from "mongoose";
import { IPayment } from "./paymentInterface";

export interface IPickupRequest extends Document {
    userId: mongoose.Types.ObjectId;
    driverId?: mongoose.Types.ObjectId;
    wasteplantId?: mongoose.Types.ObjectId;
    truckId?: mongoose.Types.ObjectId;
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
    trackingStatus?: 'Assigned' | 'InTransit' | 'Near' | 'Arrived' | 'Completed' | null;
    eta?: {
      text: string | null;
      value: number | null;
    };
    payment: IPayment;
    createdAt: Date;
    updatedAt: Date;
  }
    export interface IPickupRequestDocument extends IPickupRequest, Document {
      _id: Types.ObjectId;
    }

    export  interface Address {
      _id: string;
      addressLine1: string;
      addressLine2?: string;
      taluk: string;
      location: string;
      state: string;
      pincode: string;
      district: string;
      latitude?: number;
      longitude?: number
    }
    export interface PopulatedUser {
      _id: Types.ObjectId;
      firstName: string;
      lastName: string;
      addresses: Address[];
    }

  export type PopulatedPickup = Omit<IPickupRequestDocument, 'userId'> & {
  userId: PopulatedUser;
};

