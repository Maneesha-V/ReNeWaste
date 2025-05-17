import { ITruck } from "../../models/truck/interfaces/truckInterface";

export interface PaginatedTrucksResult {
  trucks: ITruck[];
  total: number;
}