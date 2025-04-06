import bcrypt from "bcrypt";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import WastePlantRepository  from "../../repositories/wastePlant/wastePlantRepository";
import { IWastePlantService } from "./interface/IWastePlantService";
import { checkForDuplicateWastePlant } from "../../utils/wastePlantDuplicateValidator"

class WastePlantService implements IWastePlantService {
  async addWastePlant(data: IWastePlant): Promise<IWastePlant> {
    await checkForDuplicateWastePlant({
      email: data.email,
      licenseNumber: data.licenseNumber,
      plantName: data.plantName,
    });
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(data.password, salt);
      const newData: IWastePlant = {
        ...data,
        password: hashedPassword
      };
    return await WastePlantRepository.createWastePlant(newData);
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
  async updateWastePlantByIdService(id: string, data: any): Promise<IWastePlant | null> {
    try {
      return await WastePlantRepository.updateWastePlantById(id, data);
    } catch (error) {
      throw new Error("Error updating waste plant in service");
    }
  }
}
export default new WastePlantService()