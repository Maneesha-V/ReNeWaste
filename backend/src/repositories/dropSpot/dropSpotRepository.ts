import mongoose from "mongoose";
import { DropSpotModel } from "../../models/dropSpots/dropSpotModel";
import { IDropSpot } from "../../models/dropSpots/interfaces/dropSpotInterface";
import { IDropSpotRepository } from "./interface/IDropSpotRepository";

class DropSpotRepository implements IDropSpotRepository {
  async createDropSpot(payload: IDropSpot) {
    const created = new DropSpotModel(payload);
    return await created.save();
  }
  async getDropSpotsByWastePlantId(wasteplantId: string) {
    return await DropSpotModel.find({ wasteplantId });
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
