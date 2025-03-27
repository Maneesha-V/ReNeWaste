import  { Document, Types } from "mongoose";

export interface IAddress {
    addressLine1: string;  
    addressLine2?: string; 
    location: string;      
    state: string;         
    pincode: string;      
    district: string;            
  }

  export interface IAddressDocument extends IAddress, Document {
    _id: Types.ObjectId;
  }