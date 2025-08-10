import { BaseDTO } from "../base/BaseDTO";

export interface SubsptnPlansDTO extends BaseDTO {
  billingCycle?: string;
  description?: string;
  driverLimit?: number;
  planName?: string;
  price?: number;
  trialDays?: number;
  truckLimit?: number;
  userLimit?: number;
  status?: string;
  isDeleted?: boolean;
};