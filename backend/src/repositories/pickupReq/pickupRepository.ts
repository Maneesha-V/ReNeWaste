import mongoose, { Types } from "mongoose";
import {
  IPickupRequest,
  IPickupRequestDocument,
  PopulatedPickup,
} from "../../models/pickupRequests/interfaces/pickupInterface";
import { PickupModel } from "../../models/pickupRequests/pickupModel";
import { PickupFilterParams } from "../../types/wastePlant/authTypes";
import {
  EnhancedPickup,
  IPickupRepository,
} from "./interface/IPickupRepository";
import { IUpdatePickupRequest } from "../../types/wastePlant/pickupTypes";
import { PickupDriverFilterParams } from "../../types/driver/pickupTypes";
import { UserModel } from "../../models/user/userModel";

class PickupRepository implements IPickupRepository {
  async getPickupById(pickupReqId: string) {
    const pickup = await PickupModel.findById(pickupReqId);
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


    const pickups = await PickupModel.find(query)
      .populate({
        path: "userId", 
        select: "firstName lastName addresses", 
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
      console.log("userAddress", userAddress);

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
    const pickups = (await PickupModel.find({
      driverId: driverId,
      wasteType: wasteType,
      status: { $in: ["Scheduled", "Rescheduled"] },
    }).populate({
      path: "userId",
      select: "firstName lastName addresses",
    })) as unknown as PopulatedPickup[];

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
  async findPickupByIdAndDriver(pickupReqId: string, driverId: string) {
    const objectIdPickup = new Types.ObjectId(pickupReqId);
    const objectIdDriver = new Types.ObjectId(driverId);
    const pickup = (await PickupModel.findOne({
      _id: objectIdPickup,
      driverId: objectIdDriver,
    }).lean()) as EnhancedPickup;

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
      trackingStatus: "Assigned";
    }
  ) {
    const res = await PickupModel.findByIdAndUpdate(pickupReqId, {
      eta: updateFields.eta,
      trackingStatus: updateFields.trackingStatus,
    });
    console.log("trackk", res);
  }
  
  async getPickupPlansByUserId(userId: string) {
    const pickups = await PickupModel.find({ userId })
      .populate({
        path: "driverId",
        select: "name contact assignedTruckId",
        populate: {
          path: "assignedTruckId",
          select: "name vehicleNumber",
        },
      })
      .lean();

    const user = await UserModel.findById(userId).lean();

    (pickups as any[]).forEach((pickup) => {
      const matchedAddress = user?.addresses?.find(
        (address) => address._id.toString() === pickup.addressId?.toString()
      );
      pickup.address = matchedAddress || null;
      pickup.user = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
      };
    });

    const sortedPickups = pickups.sort((a, b) => {
      const aDate = new Date(a.rescheduledPickupDate || a.originalPickupDate);
      const bDate = new Date(b.rescheduledPickupDate || b.originalPickupDate);

      const aDateTime = new Date(
        `${aDate.toISOString().split("T")[0]}T${a.pickupTime}:00Z`
      );
      const bDateTime = new Date(
        `${bDate.toISOString().split("T")[0]}T${b.pickupTime}:00Z`
      );

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
  async updatePickupStatus(pickupReqId: string, status: string) {
    const res = await PickupModel.findOneAndUpdate(
      { pickupReqId },
      { status: status },
      { new: true }
    );
    return res;
  }
  async getPickupByUserIdAndPickupReqId(pickupReqId: string, userId: string) {
    return await PickupModel.findOne(
      { 
      _id: pickupReqId,
      userId: userId
    }
    );
  }
  async savePaymentDetails(
  pickupReqId: string,
  paymentData: any,
  userId: string
  ) {
const pickup = await PickupModel.findOneAndUpdate(
    { _id: pickupReqId, userId },
    { $set: { payment: paymentData } },
    { new: true }
  );

  if (!pickup) {
    throw new Error("Pickup not found or unauthorized");
  }

  return pickup;
  }
  
  async getAllPaymentsByUser(userId: string) {
    return await PickupModel.find(
      {
        userId,
        "payment.amount": { $exists: true }, 
      },
      {
        pickupId: 1,
        payment: 1,
        wasteType: 1,
        originalPickupDate: 1,
        rescheduledPickupDate: 1,
        status: 1,
      }
    )
    .sort({ createdAt: -1 }); 
  }
  
}
export default new PickupRepository();
