import { Schema, model, Document } from "mongoose";
import { IAddressDocument } from "./interfaces/addressInterface";

export const AddressSchema: Schema<IAddressDocument> = new Schema({
  addressLine1: { 
    type: String, 
    required: true 
},  
  addressLine2: { 
    type: String 
},                  
  location: { 
    type: String, 
    required: true 
},      
  state: { 
    type: String, 
    required: true 
},         
  pincode: { 
    type: String, 
    required: true 
},       
  district: { 
    type: String, 
    required: true 
},            
});
