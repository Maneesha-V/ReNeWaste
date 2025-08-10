import mongoose, { PipelineStage, Types } from "mongoose";
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
import { PickupDriverFilterParams } from "../../types/driver/pickupTypes";
import BaseRepository from "../baseRepository/baseRepository";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../user/interface/IUserRepository";
import { IUserDocument } from "../../models/user/interfaces/userInterface";
import {
  PickupStatus,
  PickupStatusByWasteType,
  WasteType,
  RevenueByWasteType,
  PaymentRecord,
} from "./types/pickupTypes";
import {
  FetchPaymentPayload,
  PaginatedPaymentsResult,
} from "../../types/wastePlant/paymentTypes";
import { populate } from "dotenv";
import { FilterReport } from "../../types/wastePlant/reportTypes";
import { PopulatedPIckupPlans } from "../../dtos/pickupReq/pickupReqDTO";

@injectable()
export class PickupRepository
  extends BaseRepository<IPickupRequestDocument>
  implements IPickupRepository
{
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
  ) {
    super(PickupModel);
  }
  async getPickupById(pickupReqId: string) {
    const pickup = await this.model.findById(pickupReqId);
    if (!pickup) throw new Error("Pickup not found");
    return pickup;
  }
  async createPickup(pickupData: Partial<IPickupRequest>) {
    const count = await this.model.countDocuments();
    const paddedId = String(count + 1).padStart(4, "0");
    const pickupId = `PUR${paddedId}`;
    const newPickup = new this.model({
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

    const pickups = await this.model
      .find(query)
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
      truckId: string;
    }
  ) {
    const objectId = new Types.ObjectId(pickupReqId);
    const updated = await this.model
      .findByIdAndUpdate(
        objectId,
        {
          $set: {
            status: updateData.status,
            driverId: updateData.driverId,
            truckId: updateData.truckId,
          },
        },
        { new: true }
      )
      .exec();

    if (!updated) {
      throw new Error("Pickup request not found");
    }
    return updated;
  }
  async updatePickupRequest(pickupReqId: string) {
    try {
      const updatedPickupRequest = await this.model.findByIdAndUpdate(
        pickupReqId,
        { $set: { status: "Cancelled" } },
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
    const updated = await this.model.findByIdAndUpdate(
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
    const pickups = (await this.model
      .find({
        driverId: driverId,
        wasteType: wasteType,
        status: { $in: ["Scheduled", "Rescheduled"] },
      })
      .populate({
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
    const pickup = (await this.model
      .findOne({
        _id: objectIdPickup,
        driverId: objectIdDriver,
      })
      .lean()) as EnhancedPickup;

    if (!pickup) return null;

    const user = await this._userRepository.findOne(
      { _id: pickup.userId, "addresses._id": pickup.addressId },
      { "addresses.$": 1, firstName: 1, lastName: 1 },
      true
    );

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
      // trackingStatus: "Assigned";
    }
  ) {
    const res = await this.model.findByIdAndUpdate(pickupReqId, {
      eta: updateFields.eta,
      // trackingStatus: updateFields.trackingStatus,
    });
    console.log("trackk", res);
  }

 async getPickupPlansByUserId(
    userId: string, page: number, limit: number, search: string, filter: string
  ): Promise<{ pickupPlans: PopulatedPIckupPlans[]; total: number }> {

    const searchRegex = new RegExp(search, "i");

  const query: any = {
    userId: new mongoose.Types.ObjectId(userId),
  };
if(filter && filter !== "All"){
  query.status = filter
}
  if (search.trim()) {
    query.$or = [
      { status: { $regex: searchRegex } },
      { pickupTime: { $regex: searchRegex } },
      { pickupId: { $regex: searchRegex } },
    ];
  }

  const skip = (page - 1) * limit;
 const [pickups, total] = await Promise.all([
    this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "driverId",
        select: "name contact",
      })
      .populate({
        path: "truckId",
        select: "name vehicleNumber",
      })
      .lean(),
    this.model.countDocuments(query),
  ]);

    const user: IUserDocument = await this._userRepository.findById(
      userId,
      true
    );

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
    type TrackingStatus = "Pending" | "Scheduled" | "Completed" | "Cancelled";
    const sortedPickups = pickups.sort((a, b) => {
      const statusOrder: Record<TrackingStatus, number> = {
        Pending: 1,
        Scheduled: 1,
        Completed: 3,
        Cancelled: 4,
      };
      const aStatusPriority = statusOrder[a.status as TrackingStatus] ?? 99;
      const bStatusPriority = statusOrder[b.status as TrackingStatus] ?? 99;

      if (aStatusPriority !== bStatusPriority) {
        return aStatusPriority - bStatusPriority;
      }

      const aDate = new Date(a.rescheduledPickupDate || a.originalPickupDate);
      const bDate = new Date(b.rescheduledPickupDate || b.originalPickupDate);

      const aDateTime = new Date(
        `${aDate.toISOString().split("T")[0]}T${a.pickupTime}:00Z`
      );
      const bDateTime = new Date(
        `${bDate.toISOString().split("T")[0]}T${b.pickupTime}:00Z`
      );

      return aDateTime.getTime() - bDateTime.getTime();
    });

  return {
  pickupPlans: sortedPickups.map((p) => {
    const matchedAddress = user?.addresses?.find(
      (a) => a._id.toString() === p.addressId?.toString()
    );

    const address = matchedAddress
      ? {
          ...matchedAddress, 
          _id: matchedAddress._id.toString(), 
        }
      : null;

    return {
      ...p,
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
          }
        : null,
      address,
    };
  }) as PopulatedPIckupPlans[],
  total,
};

  }

  async updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string
  ): Promise<IPickupRequestDocument | null> {
    const updatedPickup = await this.model.findByIdAndUpdate(
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
    const res = await this.model.findByIdAndUpdate(
      pickupReqId,
      { status },
      { new: true }
    );
    return res;
  }

  async markPickupCompletedStatus(
    pickupReqId: string
  ): Promise<IPickupRequestDocument | null> {
    const pickup = await this.model.findById(pickupReqId);
    console.log("pickup.....", pickup);

    if (!pickup) {
      throw new Error("Pickup not found");
    }
    if (pickup.trackingStatus !== "Completed") {
      throw new Error(
        "Cannot mark pickup as completed until tracking is completed"
      );
    }
    if (pickup.payment.status !== "Paid") {
      throw new Error(
        "Cannot mark pickup as completed until payment is completed"
      );
    }
    pickup.status = "Completed";
    const updatedPickup = await pickup.save();

    return updatedPickup;
  }
  async getPickupByUserIdAndPickupReqId(pickupReqId: string, userId: string) {
    return await this.model.findOne({
      _id: pickupReqId,
      userId: userId,
    });
  }
  // async savePaymentDetails({
  //   pickupReqId,
  //   paymentData,
  //   userId,
  // }: SavePaymentReq) {
  //   const pickup = await this.model.findOneAndUpdate(
  //     { _id: pickupReqId, userId },
  //     { $set: { payment: paymentData } },
  //     { new: true }
  //   );

  //   if (!pickup) {
  //     throw new Error("Pickup not found or unauthorized");
  //   }
  // }

  async getAllPaymentsByUser(userId: string) {
    return await this.model
      .find(
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
  async fetchAllPickupsByPlantId(
    plantId: string
  ): Promise<PickupStatusByWasteType> {
    const pickupCounts = await this.model.aggregate([
      {
        $match: {
          wasteplantId: new Types.ObjectId(plantId),
        },
      },
      {
        $group: {
          _id: {
            wasteType: "$wasteType",
            status: "$status",
          },
          totalCount: { $sum: 1 },
        },
      },
    ]);
    const result: PickupStatusByWasteType = {
      Residential: {
        Pending: 0,
        Scheduled: 0,
        Rescheduled: 0,
        Completed: 0,
        Cancelled: 0,
        Active: 0,
      },
      Commercial: {
        Pending: 0,
        Scheduled: 0,
        Rescheduled: 0,
        Completed: 0,
        Cancelled: 0,
        Active: 0,
      },
    };
    for (const record of pickupCounts) {
      const { wasteType, status } = record._id;
      const count = record.totalCount;

      if (
        (wasteType === "Residential" || wasteType === "Commercial") &&
        (status === "Pending" ||
          status === "Scheduled" ||
          status === "Rescheduled" ||
          status === "Completed" ||
          status === "Cancelled")
      ) {
        const typeKey = wasteType as WasteType;
        const statusKey = status as PickupStatus;
        result[typeKey][statusKey] = record.totalCount;
      }
    }

    for (const type of ["Residential", "Commercial"] as const) {
      result[type].Active = result[type].Scheduled + result[type].Rescheduled;
    }

    return result;
  }
  async totalRevenueByPlantId(plantId: string): Promise<RevenueByWasteType> {
    const result = await this.model.aggregate([
      {
        $match: {
          wasteplantId: new Types.ObjectId(plantId),
          "payment.status": "Paid",
        },
      },
      {
        $group: {
          _id: "$wasteType",
          total: { $sum: "$payment.amount" },
        },
      },
    ]);

    let totalResidentialRevenue = 0;
    let totalCommercialRevenue = 0;

    for (const item of result) {
      if (item._id === "Residential") {
        totalResidentialRevenue = item.total;
      } else if (item._id === "Commercial") {
        totalCommercialRevenue = item.total;
      }
    }

    const totalRevenue = totalResidentialRevenue + totalCommercialRevenue;

    return {
      totalResidentialRevenue,
      totalCommercialRevenue,
      totalRevenue,
    };
  }

  async fetchAllPaymentsByPlantId(
    data: FetchPaymentPayload
  ): Promise<PaginatedPaymentsResult> {
    const { plantId, page, limit, search } = data;

    const matchStage: PipelineStage.Match = {
      wasteplantId: new Types.ObjectId(plantId),
      "payment.status": "Paid",
    } as any;

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "drivers",
          localField: "driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ];

    // 🔍 Add a second $match after lookups for search
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { pickupId: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } },
            { "driver.name": { $regex: search, $options: "i" } },
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$payment.amount" },
                  regex: search,
                  options: "i",
                },
              },
            },
          ],
        },
      });
    }

    // Final transformation and pagination
    pipeline.push(
      {
        $project: {
          pickupId: 1,
          wasteType: 1,
          status: 1,
          "payment.status": 1,
          "payment.razorpayPaymentId": 1,
          "payment.amount": 1,
          "payment.paidAt": 1,
          "payment.refundStatus": 1,
          "payment.refundRequested": 1,
          "payment.refundAt": 1,
          "payment.inProgressExpiresAt": 1,
          driverName: "$driver.name",
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          dueDate: {
            $cond: {
              if: { $ne: ["$rescheduledPickupDate", null] },
              then: "$rescheduledPickupDate",
              else: "$originalPickupDate",
            },
          },
        },
      },
      { $sort: { "payment.paidAt": -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    // Get both data and count (filtered count)
    const [paymentData, countResult] = await Promise.all([
      this.model.aggregate(pipeline),
      this.model.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "drivers",
            localField: "driverId",
            foreignField: "_id",
            as: "driver",
          },
        },
        { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        ...(search
          ? [
              {
                $match: {
                  $or: [
                    { pickupId: { $regex: search, $options: "i" } },
                    { status: { $regex: search, $options: "i" } },
                    { "user.firstName": { $regex: search, $options: "i" } },
                    { "user.lastName": { $regex: search, $options: "i" } },
                    { "driver.name": { $regex: search, $options: "i" } },
                    {
                      $expr: {
                        $regexMatch: {
                          input: { $toString: "$payment.amount" },
                          regex: search,
                          options: "i",
                        },
                      },
                    },
                  ],
                },
              },
            ]
          : []),
        { $count: "total" },
      ]),
    ]);

    const total = countResult.length > 0 ? countResult[0].total : 0;

    return {
      payments: paymentData,
      total,
    };
  }

  async updatePaymentStatus(pickupReqId: string) {
    try {
      const updatedPickupRequest = await this.model.findByIdAndUpdate(
        pickupReqId,
        {
          $set: {
            "payment.refundRequested": true,
          },
        },
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
  async getPickupWithUserAndPlantId(
    plantId: string,
    userId: string,
    pickupId: string
  ): Promise<IPickupRequestDocument | null> {
    const data = await this.model.findOne({
      pickupId,
      wasteplantId: plantId,
      userId,
    });
    return data;
  }
  async filterWasteReportsByPlantId(
    data: FilterReport
  ): Promise<IPickupRequestDocument[]> {
    const fromDate = new Date(`${data.from}T00:00:00.000Z`);
    const toDate = new Date(`${data.to}T23:59:59.999Z`);

    const pickups = await this.model
      .find({
        wasteplantId: data.plantId,
        "payment.paidAt": { $gte: fromDate, $lte: toDate },
        "payment.refundStatus": { $ne: "Refunded" },
      })
      .populate({
        path: "driverId",
        select: "name",
      });

    return pickups;
  }
  async fetchWasteReportsByPlantId(plantId: string) {
    const pickups = await this.model
      .find({
        wasteplantId: plantId,
        status: "Completed",
        "payment.refundStatus": { $ne: "Refunded" },
      })
      .populate({
        path: "driverId",
        select: "name",
      });

    return pickups;
  }
  async getDriverTotalPickups(driverId: string): Promise<{
    assignedCount: number;
    completedCount: number;
  }> {
    const pickups = await this.model.find({
      driverId: driverId,
      status: { $in: ["Scheduled", "Rescheduled", "Completed"] },
    });

    let assignedCount = 0;
    let completedCount = 0;

    for (const pickup of pickups) {
      if (pickup.status === "Completed") {
        completedCount++;
      } else {
        assignedCount++;
      }
    }

    return {
      assignedCount,
      completedCount,
    };
  }
  async getMonthlyPickupPlansByUserId(
    userId: string
  ): Promise<{ count: number }> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    const result = await this.model.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          wasteType: "Residential",
        },
      },
      {
        $addFields: {
          effectiveDate: {
            $cond: [
              { $ifNull: ["$rescheduledPickupDate", false] },
              "$rescheduledPickupDate",
              "$originalPickupDate",
            ],
          },
        },
      },
      {
        $match: {
          effectiveDate: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $count: "pickupCount",
      },
    ]);
    console.log("result", result);

    const count = result.length > 0 ? result[0].pickupCount : 0;
    return { count };
  }
  async totalRevenueByMonth(): Promise<{ month: string; totalRevenue: number }[]> {
    const result =  await this.model.aggregate([
      {
        $match: {
          "payment.status": "Paid",
          "payment.refundStatus": null,
          "payment.paidAt": { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$payment.paidAt" },
            month: { $month: "$payment.paidAt" },
          },
          totalRevenue: { $sum: "$payment.amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          totalRevenue: 1,
        },
      },
      {
        $sort:{ month: 1}
      }
    ]);
    return result;
  }
  async getAllPickupsByStatus(plantId: string) {
    return await this.model.find({
      wasteplantId: plantId,
      status: { $in: ["Pending", "Scheduled", "Rescheduled"] }
    })   
  }
}
