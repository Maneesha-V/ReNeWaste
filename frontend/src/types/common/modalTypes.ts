import { ReactNode } from "react";
import { modifyCommPickReq, PickupCancelData, PickupReqDTO } from "../pickupReq/pickupTypes";
import { SubcptnPaymtPayload } from "../subscription/subscriptionTypes";
import { MeasureDataPayload } from "../wasteCollections/wasteCollectionTypes";
import { AddMoneyReq } from "../wallet/walletTypes";
import { PaymentRecord, ReschedulePickupReq } from "../wasteplant/wastePlantTypes";
import { UserResp } from "../user/userTypes";
import { DriverDTO } from "../driver/driverTypes";
import { cancelSubPayReq } from "../../redux/slices/wastePlant/wastePlantSubscriptionSlice";

export type AdminHeaderProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
  isNotifOpen: boolean;
  setIsNotifOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export type AdminSidebarProps = {
  collapsed: boolean;
  children?: ReactNode;
  isNotifOpen?: boolean;
};

export type PickupCommercialFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  serviceQuery: string | null;
  user: UserResp;
}
export type PickupResidentialFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  user: UserResp;
}
export interface TrackModalProps {
  visible: boolean;
  onClose: () => void;
  trackingStatus: string | null;
  pickupId: string;
  eta: { text: string | null } | null;
}
export type PayNowProps = {
  onClose: () => void;
};

export interface CancelPickupModalProps {
  visible: boolean;
  onClose: () => void;
  pickupId: string | null;
  cancelAction: (args: PickupCancelData) => any;
}
export type NotificationPanelProps = {
  onClose: () => void;
}
export type MainContentProps = {
  children: ReactNode;
};
interface BaseNotificationPanelProps {
  onClose: () => void;
}

export interface UserNotificationPanelProps extends BaseNotificationPanelProps {}


export interface WastePlantNotificationPanelProps extends BaseNotificationPanelProps {
  visible: boolean;
  plantId: string;
  onOpenMeasureWaste: (data: MeasureDataPayload) => void;
}

export interface DriverNotificationPanelProps extends BaseNotificationPanelProps {
  visible: boolean;
}
export interface SuperAdminNotificationPanelProps extends BaseNotificationPanelProps {
  visible: boolean;
  adminId: string;
}
export interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}
export interface SubscriptionPayModalProps {
  visible: boolean;
  onClose: () => void;
  plan?: SubcptnPaymtPayload | null;
}
export interface CancelSubptnModalProps {
  visible: boolean;
  onClose: () => void;
  subPayId: string | null;
  // cancelAction: (args: SubscptnCancelReq) => any;
  cancelAction: typeof cancelSubPayReq;
}
export interface DriverChatWindowProps {
  driver: DriverDTO;
  wasteplantId: string;
}
export interface ReschedulePickupModalProps {
  visible: boolean;
  onClose: () => void;
  pickup: PickupReqDTO;
  onSubmit: (formData: ReschedulePickupReq) => void;
}
export type DriverHeaderProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
  isNotifOpen: boolean;
  setIsNotifOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export type DriverSidebarProps = {
  collapsed: boolean;
  children?: ReactNode;
};
type MenuItemType = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type MenuItemProps = {
  item: MenuItemType;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
};
export type SidebarWastePlantProps = {
  collapsed: boolean;
  children?: ReactNode;
  isNotifOpen: boolean;
};
export type AddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddMoneyReq) => void;
}
export interface ModifyCommercialPickupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: modifyCommPickReq) => void;
  currentFrequency: string;
}
export interface ModifyRequestModalProps {
  open: boolean;
  onClose: () => void;
  pickup: PickupReqDTO | null;
  onApprove: (pickupReqId: string) => void;
  onReject: (pickupReqId: string) => void;
}
export interface AssignDriverModalProps {
  visible: boolean;
  onClose: () => void;
  pickup: PickupReqDTO;
  onSuccess: () => void;
}
export interface WPRefundModalProps {
  visible: boolean;
  onClose: () => void;
  record: PaymentRecord;
  onUpdateStatus: (status: string) => void;
  onRefund: () => void;
}