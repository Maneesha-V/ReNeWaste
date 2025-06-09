export interface ApprovePickupDTO {
  plantId: string;
  pickupReqId: string;
  status: string;
  driverId: string;
  assignedTruckId: string;
}

export interface ReschedulePickupDTO {
  driverId: string;
  assignedZone: string;
  rescheduledPickupDate: string; 
  pickupTime: string;
  status: string;
}
