import {
  IWastePlant,
  IWastePlantDocument,
} from "../../models/wastePlant/interfaces/wastePlantInterface";
import { WastePlantModel } from "../../models/wastePlant/wastePlantModel";
import { IWastePlantRepository } from "./interface/IWastePlantRepository";

export class WastePlantRepository implements IWastePlantRepository {
  
  async createWastePlant(data: IWastePlant): Promise<IWastePlantDocument> {
    try {
      const wastePlant = new WastePlantModel(data);
      console.log("wastePlantData", wastePlant);
      return await wastePlant.save();
    } catch (error: any) {
      console.error("MongoDB Insert Error:", error);
      throw error;
    }
  }

  async findWastePlantByEmail(email: string): Promise<IWastePlant | null> {
    return await WastePlantModel.findOne({ email });
  }

  async getAllWastePlants(): Promise<IWastePlant[]> {
    return await WastePlantModel.find();
  }
  async getWastePlantById(id: string) {
    return await WastePlantModel.findById(id);
  }
}
export default new WastePlantRepository();
