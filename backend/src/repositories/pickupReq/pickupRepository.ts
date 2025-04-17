import mongoose from "mongoose";
import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import { PickupModel } from "../../models/pickupRequests/pickupModel";
import { PickupFilterParams } from "../../types/wastePlant/authTypes";
import { IPickupRepository } from "./interface/IPickupRepository";


class PickupRepository implements IPickupRepository {
    async createPickup(pickupData: Partial<IPickupRequest>) {
        const newPickup = new PickupModel(pickupData);
        return await newPickup.save();
      }
      async getPickupsByPlantId(filters: PickupFilterParams): Promise<IPickupRequest[]> {
        const { plantId, status , wasteType } = filters;

        const query: any = {
          wasteplantId: new mongoose.Types.ObjectId(plantId), 
          status,
        };
      
        if (wasteType) {
          query.wasteType = wasteType;
        }
      
        // const pickupData = await PickupModel.find(query).sort({ createdAt: -1 });
        const pickups = await PickupModel.find(query)
        .populate({
          path: "userId", // The field referring to the User model
          select: "firstName lastName addresses", // Populate both `firstName`, `lastName`, and `addresses` from the User model
        })
        .sort({ createdAt: -1 });
    
      // Processing the populated data
      return pickups.map((pickup: any) => {
        // Check if userId is populated and addresses exist
        if (!pickup.userId || !pickup.userId.addresses) {
          return { ...pickup.toObject(), userName: "Unknown", location: "Unknown" };
        }
    
        // Find the address using the pickup's addressId
        const userAddress = pickup.userId.addresses.find(
          (address: any) => address._id.toString() === pickup.addressId.toString()
        );
        // Create userName and get location
        const userName = `${pickup.userId.firstName} ${pickup.userId.lastName}`;
        const location = userAddress ? userAddress.location : null;
    
        return {
          ...pickup.toObject(),
          userName,
          location,
          userAddress
        };
      });
      }

}
export default new PickupRepository();