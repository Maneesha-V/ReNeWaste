import { PickupCancelData } from "../pickupReq/pickupTypes";

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