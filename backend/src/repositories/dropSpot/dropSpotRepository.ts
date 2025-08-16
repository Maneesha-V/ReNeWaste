import mongoose from "mongoose";
import { DropSpotModel } from "../../models/dropSpots/dropSpotModel";
import { IDropSpot, IDropSpotDocument } from "../../models/dropSpots/interfaces/dropSpotInterface";
import { IDropSpotRepository } from "./interface/IDropSpotRepository";
import { PaginatedDropSpotsResult } from "../../types/wastePlant/dropspotTypes";
import BaseRepository from "../baseRepository/baseRepository";
import { injectable } from "inversify";

@injectable()
export class DropSpotRepository extends BaseRepository<IDropSpotDocument>  implements IDropSpotRepository {
  constructor() {
    super(DropSpotModel);
  } 
  async createDropSpot(payload: IDropSpot) {
    const created = new this.model(payload);
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

    const dropspots = await this.model.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(query);

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
  }): Promise<IDropSpotDocument[]> {
    return await this.model.find({
      location,
      district,
      state,
      wasteplantId,
    });
  }

  async findDropSpotById(dropSpotId: string) {
    console.log(dropSpotId);

    return await this.model.findOne({
      _id: new mongoose.Types.ObjectId(dropSpotId),
    });
  }
  async deleteDropSpotById(dropSpotId: string, wasteplantId: string) {
    return await this.model.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(dropSpotId),
      wasteplantId,
    });
  }

  async updateDropSpot(dropSpotId: string, updateData: any) {
    return await this.model.findByIdAndUpdate(dropSpotId, updateData, {
      new: true,
    });
  }
}


