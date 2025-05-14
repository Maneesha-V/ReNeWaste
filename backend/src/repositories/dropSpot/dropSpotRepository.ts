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
  wasteplantId
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
    wasteplantId
  });
}

}

export default new DropSpotRepository();