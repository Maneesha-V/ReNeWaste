import { IWastePlantDocument } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export type PaginatedWastePlantResult = {
  wasteplants: IWastePlantDocument[];
  total: number;
}