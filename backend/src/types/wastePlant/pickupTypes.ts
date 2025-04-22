export interface ApprovePickupDTO {
  pickupReqId: string;
  // pickupId: string;
  status: string;
  driverId: string;
  assignedZone: string;
  assignedTruckId: string;
}
export interface IUpdatePickupRequest {
  status: string;
}
export interface ReschedulePickupDTO {
  driverId: string;
  assignedZone: string;
  rescheduledPickupDate: string; 
  status: string;
}
