export interface TrackModalProps {
  visible: boolean;
  onClose: () => void;
  trackingStatus: string | null;
  pickupId: string;
  eta: { text: string | null } | null;
}
export interface PickupCommercialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  serviceQuery: string | null;
  user: any;
}
export interface PickupResidentialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  user: any;
}
export interface UserDropSpot {
  _id: string;
  dropSpotName: string;
  addressLine: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
export type PayNowProps = {
  onClose: () => void;
};