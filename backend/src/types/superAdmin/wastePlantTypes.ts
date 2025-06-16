import { IWastePlantDocument } from "../../models/wastePlant/interfaces/wastePlantInterface";

export type notificationPayload = {
  plantId: string;
  adminId: string;
};
export type ReturnAdminWastePlant = {
  plantData: IWastePlantDocument;
  latestSubscription: {
    subPaymentStatus?: string;
    expiredAt?: Date;
    daysLeft?: number;
  } | null;
};
