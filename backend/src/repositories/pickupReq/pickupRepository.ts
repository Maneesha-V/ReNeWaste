import mongoose, { Types } from "mongoose";
import { IPickupRequest, IPickupRequestDocument, PopulatedPickup } from "../../models/pickupRequests/interfaces/pickupInterface";
import { PickupModel } from "../../models/pickupRequests/pickupModel";
import { PickupFilterParams } from "../../types/wastePlant/authTypes";
import { EnhancedPickup, IPickupRepository } from "./interface/IPickupRepository";
import { IUpdatePickupRequest } from "../../types/wastePlant/pickupTypes";
import { PickupDriverFilterParams } from "../../types/driver/pickupTypes";
import { UserModel } from "../../models/user/userModel";

class PickupRepository implements IPickupRepository {
  async getPickupById(pickupReqId: string) {
    const pickup = await PickupModel.findById(pickupReqId)
    if (!pickup) throw new Error("Pickup not found");
    return pickup;
  }
  async createPickup(pickupData: Partial<IPickupRequest>) {
    const count = await PickupModel.countDocuments();
    const paddedId = String(count + 1).padStart(4, "0");
    const pickupId = `PUR${paddedId}`;
    const newPickup = new PickupModel({
      ...pickupData,
      pickupId,
    });
    return await newPickup.save();
  }
  async getPickupsByPlantId(
    filters: PickupFilterParams
  ): Promise<IPickupRequest[]> {
    const { plantId, status, wasteType } = filters;

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
        select: "name assignedZone",
      })
      .sort({ createdAt: -1 });

    return pickups.map((pickup: any) => {
      const pickupObj = pickup.toObject();

      const userName = pickup.userId
        ? `${pickup.userId.firstName} ${pickup.userId.lastName}`
        : "Unknown";

      const userAddress = pickup.userId?.addresses?.find(
        (address: any) =>
          address._id.toString() === pickup.addressId?.toString()
      );
      console.log("userAddress",userAddress);
      

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
    const updated = await PickupModel.findByIdAndUpdate(
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
  async updatePickupRequest(
    pickupReqId: string,
    updatePayload: IUpdatePickupRequest
  ) {
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
    const updated = await PickupModel.findByIdAndUpdate(
      pickupReqId,
      updateData,
      { new: true }
    );

    if (!updated) {
      throw new Error("Pickup request not found during update");
    }

    return updated;
  }
  async getPickupsByDriverId(filters: PickupDriverFilterParams) {
    const { driverId, wasteType } = filters;
    const pickups = await PickupModel.find({
      driverId: driverId,
      wasteType: wasteType,
      status: {$in: ["Scheduled", "Rescheduled"]}
    })
    .populate({
      path: "userId",
      select: "firstName lastName addresses"
    }) as unknown as PopulatedPickup[];
    
    const enhancedPickups = pickups.map((pickup) => {
      const user = pickup.userId;
      const matchedAddress = user.addresses?.find(
        (addr: any) => addr._id.toString() === pickup.addressId.toString()
      );
    
      return {
        ...pickup.toObject?.(),
        userFullName: `${user.firstName} ${user.lastName}`,
        selectedAddress: matchedAddress,
      };
    });
    

    return enhancedPickups;
  }
  async findPickupByIdAndDriver (pickupReqId: string, driverId: string) {
    const objectIdPickup = new Types.ObjectId(pickupReqId);
    const objectIdDriver = new Types.ObjectId(driverId);
    const pickup = await PickupModel.findOne({ _id: objectIdPickup, driverId: objectIdDriver })
    .lean() as EnhancedPickup;;
    
    if (!pickup) return null;

    const user = await UserModel.findOne(
      { _id: pickup.userId, "addresses._id": pickup.addressId },
      { "addresses.$": 1, firstName: 1, lastName: 1 }
    ).lean();

    if (user && user.addresses?.[0]) {
      pickup.selectedAddress = user.addresses[0];
      pickup.userFullName = `${user.firstName} ${user.lastName}`;
    } else {
      pickup.selectedAddress = null;
      pickup.userFullName = "Unknown User";
    }

    return pickup;

  }
  async updateETAAndTracking(
    pickupReqId: string,
    updateFields: {
      eta: { text: string; value: number };
      trackingStatus: 'Assigned';
    }
  ) {
    const res = await PickupModel.findByIdAndUpdate(pickupReqId, {
      eta: updateFields.eta,
      trackingStatus: updateFields.trackingStatus
    });
    console.log("trackk",res);
    
  }
  // async getPickupPlansByUserId(userId: string) {
  //   // return await PickupModel.find({ userId });
  //   return await PickupModel.find({ userId })
  //   .populate({
  //     path: 'driverId',
  //     select: 'name contact assignedTruckId',
  //     populate: {
  //       path: 'assignedTruckId',
  //       select: 'name vehicleNumber'
  //     }
  //   })
  //   .sort({ createdAt: -1, pickupTime: 1 }) 
  //   .lean();
  
  // }
  async getPickupPlansByUserId(userId: string) {
  const pickups = await PickupModel.find({ userId })
    .populate({
      path: 'driverId',
      select: 'name contact assignedTruckId',
      populate: {
        path: 'assignedTruckId',
        select: 'name vehicleNumber'
      }
    })
    .lean(); 

  const sortedPickups = pickups.sort((a, b) => {
    const aDate = new Date(a.rescheduledPickupDate || a.originalPickupDate);
    const bDate = new Date(b.rescheduledPickupDate || b.originalPickupDate);

    const aDateTime = new Date(`${aDate.toISOString().split('T')[0]}T${a.pickupTime}:00Z`);
    const bDateTime = new Date(`${bDate.toISOString().split('T')[0]}T${b.pickupTime}:00Z`);

    return aDateTime.getTime() - bDateTime.getTime(); // ascending: earliest first
  });

  return sortedPickups;
}

  async updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string
  ): Promise<IPickupRequestDocument | null> {
    const updatedPickup = await PickupModel.findByIdAndUpdate(
      pickupReqId,
      { trackingStatus },
      { new: true }
    );

    if (!updatedPickup) {
      throw new Error("Pickup not found");
    }

    return updatedPickup;
  }
  async updatePickupStatus(
    pickupReqId: string,
    status: string
  ){
    const res = await PickupModel.findOneAndUpdate(
      { pickupReqId },
      { status: status },
      { new: true }
    );
    console.log("repo",res);
    
    return res;
  }
}
export default new PickupRepository();
