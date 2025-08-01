import { Types } from "mongoose";

export type ReturnFetchAllDriversByPlantId = {
    active: number;
    inactive: number;
    suspended: number;
}
