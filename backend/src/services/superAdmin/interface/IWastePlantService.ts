import { IWastePlant } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface IWastePlantService {
    addWastePlant(data: IWastePlant): Promise<IWastePlant>;
    getAllWastePlants(): Promise<IWastePlant[]>;
    getWastePlantByIdService(id: string): Promise<IWastePlant | null>;
  }