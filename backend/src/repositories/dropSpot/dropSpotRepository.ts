import mongoose from "mongoose";
import { DropSpotModel } from "../../models/dropSpots/dropSpotModel";
import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";
import { IDropSpotRepository } from "./interface/IDropSpotRepository";
import { PaginatedDropSpotsResult } from "../../types/wastePlant/dropspotTypes";

class DropSpotRepository implements IDropSpotRepository {
  async createDropSpot(payload: IDropSpot) {
    const created = new DropSpotModel(payload);
    return await created.save();
  }
  async getDropSpotsByWastePlantId(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedDropSpotsResult> {
    const query = {
      wasteplantId,
      $or: [
        { dropSpotName: { $regex: search, $options: "i" } },
        { addressLine: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { pincode: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ],
    };
    const skip = (page - 1) * limit;

    const dropspots = await DropSpotModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await DropSpotModel.countDocuments(query);

    return { dropspots, total };

  }
  async getDropSpotsByLocationAndWasteplant({
    location,
    district,
    state,
    wasteplantId,
  }: {
    location: string;
    district: string;
    state: string;
    wasteplantId: mongoose.Types.ObjectId;
  }): Promise<IDropSpot[]> {
    return await DropSpotModel.find({
      location,
      district,
      state,
      wasteplantId,
    });
  }

  async findDropSpotById(dropSpotId: string) {
    console.log(dropSpotId);

    return await DropSpotModel.findOne({
      _id: new mongoose.Types.ObjectId(dropSpotId),
    });
  }
  async deleteDropSpotById(dropSpotId: string, wasteplantId: string) {
    return await DropSpotModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(dropSpotId),
      wasteplantId,
    });
  }

  async updateDropSpot(dropSpotId: string, updateData: any) {
    return await DropSpotModel.findByIdAndUpdate(dropSpotId, updateData, {
      new: true,
    });
  }
}

export default new DropSpotRepository();
