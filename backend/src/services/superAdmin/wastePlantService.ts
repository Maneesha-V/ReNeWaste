import bcrypt from "bcrypt";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { IWastePlantService } from "./interface/IWastePlantService";
import { checkForDuplicateWastePlant } from "../../utils/wastePlantDuplicateValidator";
import { injectable, inject } from "inversify";
import TYPES from "../../config/inversify/types";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";

@injectable()
export class WastePlantService implements IWastePlantService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository
  ) {}
  async addWastePlant(data: IWastePlant): Promise<IWastePlant> {
    await checkForDuplicateWastePlant(
      {
        email: data.email,
        licenseNumber: data.licenseNumber,
        plantName: data.plantName,
      },
      this.wastePlantRepository
    );
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newData: IWastePlant = {
      ...data,
      password: hashedPassword,
    };
    return await this.wastePlantRepository.createWastePlant(newData);
  }

  async getAllWastePlants(): Promise<IWastePlant[]> {
    return await this.wastePlantRepository.getAllWastePlants();
  }
  async getWastePlantByIdService(id: string): Promise<IWastePlant | null> {
    try {
      return await this.wastePlantRepository.getWastePlantById(id);
    } catch (error) {
      throw new Error("Error fetching waste plant from service");
    }
  }
  async updateWastePlantByIdService(
    id: string,
    data: any
  ): Promise<IWastePlant | null> {
    try {
      return await this.wastePlantRepository.updateWastePlantById(id, data);
    } catch (error) {
      throw new Error("Error updating waste plant in service");
    }
  }
  async deleteWastePlantByIdService(id: string) {
    return await this.wastePlantRepository.deleteWastePlantById(id);
  }
}
