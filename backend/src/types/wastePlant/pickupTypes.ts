export type ApprovePickupDTO = {
  plantId: string;
  pickupReqId: string;
  status: string;
  driverId: string;
  assignedTruckId: string;
}

export type ReschedulePickupDTO = {
  driverId: string;
  assignedZone: string;
  rescheduledPickupDate: string; 
  pickupTime: string;
  status: string;
}
