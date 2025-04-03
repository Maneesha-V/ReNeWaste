import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import WastePlantRepository  from "../../repositories/wastePlant/wastePlantRepository";
import { IWastePlantService } from "./interface/IWastePlantService";

class WastePlantService implements IWastePlantService {
  async addWastePlant(data: IWastePlant): Promise<IWastePlant> {
    const existingPlant = await WastePlantRepository.findWastePlantByEmail(data.email);
    if (existingPlant) {
      throw new Error("A waste plant with this email already exists.");
    }

    return await WastePlantRepository.createWastePlant(data);
  }

  async getAllWastePlants(): Promise<IWastePlant[]> {
    return await WastePlantRepository.getAllWastePlants();
  }
  async getWastePlantByIdService(id: string): Promise<IWastePlant | null> {
    try {
      return await WastePlantRepository.getWastePlantById(id);
    } catch (error) {
      throw new Error("Error fetching waste plant from service");
    }
  }
}
export default new WastePlantService()