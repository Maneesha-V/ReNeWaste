import { ReactNode } from "react";
import { PickupCancelData } from "../pickupReq/pickupTypes";
import { SubcptnPaymtPayload } from "../subscription/subscriptionTypes";
import { MeasureDataPayload } from "../wasteCollections/wasteCollectionTypes";

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
  user: any;
}
export type PickupResidentialFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  user: any;
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
export type CancelPickupModalProps = {
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
  cancelAction: (args: any) => any;
}
export interface DriverChatWindowProps {
  driver: any;
  wasteplantId: string;
}
export interface ReschedulePickupModalProps {
  visible: boolean;
  onClose: () => void;
  pickup: any;
  onSubmit: (formData: any) => void;
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