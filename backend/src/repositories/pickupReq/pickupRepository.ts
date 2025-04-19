import mongoose, { Types } from "mongoose";
import { IPickupRequest } from "../../models/pickupRequests/interfaces/pickupInterface";
import { PickupModel } from "../../models/pickupRequests/pickupModel";
import { PickupFilterParams } from "../../types/wastePlant/authTypes";
import { IPickupRepository } from "./interface/IPickupRepository";
import { IUpdatePickupRequest } from "../../types/wastePlant/pickupTypes";


class PickupRepository implements IPickupRepository {
  async getPickupById(pickupReqId: string) {
    const pickup = await PickupModel.findById(pickupReqId);
    if (!pickup) throw new Error("Pickup not found");
    return pickup;
  }
    async createPickup(pickupData: Partial<IPickupRequest>) {
      const count = await PickupModel.countDocuments(); 
      const paddedId = String(count + 1).padStart(4, '0');
      const pickupId = `PUR${paddedId}`;
        const newPickup = new PickupModel({
          ...pickupData,
          pickupId
        });
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
 
        // const todayStart = new Date();
        // todayStart.setHours(0, 0, 0, 0);
      
        // const today5pm = new Date();
        // today5pm.setHours(17, 0, 0, 0); // 5:00 PM cutoff
      
        // query.$or = [
        //   { pickupDate: { $gt: today5pm } }, // future pickups
        //   {
        //     $and: [
        //       { pickupDate: { $gte: todayStart } }, // today's date
        //       { pickupDate: { $lte: today5pm } },   // up to 5 PM
        //     ],
        //   },
        // ];

        const pickups = await PickupModel.find(query)
        .populate({
          path: "userId", // The field referring to the User model
          select: "firstName lastName addresses", // Populate both `firstName`, `lastName`, and `addresses` from the User model
        })
        .populate({
          path: "driverId",
          select: "name assignedZone"
        })
        .sort({ createdAt: -1 });
    
        return pickups.map((pickup: any) => {
          const pickupObj = pickup.toObject();
      
          const userName = pickup.userId
            ? `${pickup.userId.firstName} ${pickup.userId.lastName}`
            : "Unknown";
      
          const userAddress = pickup.userId?.addresses?.find(
            (address: any) => address._id.toString() === pickup.addressId?.toString()
          );
      
          const location = userAddress?.location || "Unknown";
      
          const driverName = pickup.driverId?.name || null;
          const assignedZone = pickup.driverId?.assignedZone || null;
      
          return {
            ...pickupObj,
            userName,
            userAddress,
            location,
            driverName,
            assignedZone,
          };
        });
      // // Processing the populated data
      // return pickups.map((pickup: any) => {
      //   // Check if userId is populated and addresses exist
      //   if (!pickup.userId || !pickup.userId.addresses) {
      //     return { ...pickup.toObject(), userName: "Unknown", location: "Unknown" };
      //   }
    
      //   // Find the address using the pickup's addressId
      //   const userAddress = pickup.userId.addresses.find(
      //     (address: any) => address._id.toString() === pickup.addressId.toString()
      //   );
      //   // Create userName and get location
      //   const userName = `${pickup.userId.firstName} ${pickup.userId.lastName}`;
      //   const location = userAddress ? userAddress.location : null;
    
      //   return {
      //     ...pickup.toObject(),
      //     userName,
      //     location,
      //     userAddress
      //   };
      // });
      }

      async updatePickupStatusAndDriver(
        pickupReqId: string,
        updateData: {
          status: string;
          driverId: string;
        }
      ) {
        const objectId = new Types.ObjectId(pickupReqId);
        const updated =  await PickupModel.findByIdAndUpdate(
          objectId,
          {
            $set: {
              status: updateData.status,
              driverId: updateData.driverId,
            },
          },
          { new: true }
        ).exec();

        if (!updated) {
          throw new Error("Pickup request not found");
        }
        return updated;
      }
      async updatePickupRequest(pickupReqId: string, updatePayload: IUpdatePickupRequest) {
        try {
          const updatedPickupRequest = await PickupModel.findByIdAndUpdate(
            pickupReqId,
            { $set: updatePayload }, 
            { new: true } 
          );
    
          if (!updatedPickupRequest) {
            throw new Error("Pickup request not found.");
          }
          return updatedPickupRequest;
        } catch (error) {
          console.error(error);
          throw new Error("Error in updating the pickup request.");
        }
      }
      async updatePickupDate(pickupReqId: string, updateData: any) {
        const updated = await PickupModel.findByIdAndUpdate(pickupReqId, updateData, { new: true });

        if (!updated) {
          throw new Error("Pickup request not found during update");
        }
      
        return updated;
      }
}
export default new PickupRepository();