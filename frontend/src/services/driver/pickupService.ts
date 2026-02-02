import { axiosDriver } from "../../config/axiosClients";
import { FetchEtaReq, UpdateAddressLatLngReq, UpdateTrackingStatusReq } from "../../types/driver/driverTypes";

export const getDriverPickups = async () => {
  const response = await axiosDriver.get(
    `/alloted-pickups`
  );
  return response.data;
};

export const markPickupService = async (pickupReqId: string) => {
  const response = await axiosDriver.put(`/pickup-complete/${pickupReqId}`);
  return response.data;
};
export const fetchPickupByIdService = async (pickupReqId: string) => {
  const response = await axiosDriver.get(`/track-pickup/${pickupReqId}`);
  return response.data;
};
export const fetchEtaService = async (data: FetchEtaReq) => {
  const {origin,destination,pickupReqId,addressId} = data
  // const baseUrl = import.meta.env.VITE_API_URL;
  const url = `/maps/eta?origin=${origin}&destination=${encodeURIComponent(
    destination
  )}&pickupReqId=${pickupReqId}&addressId=${addressId}`;
  const response = await axiosDriver.get(url);
  return response.data;
};
export const updateAddressLatLngService = async (data: UpdateAddressLatLngReq) => {
  const { addressId, latitude, longitude } = data;
  const response = await axiosDriver.patch(`/address/${addressId}/location`, {
    latitude,
    longitude,
  });
  return response.data;
};

export const updateTrackingStatusService = async (data: UpdateTrackingStatusReq ) => {
  const {pickupReqId,trackingStatus} = data;
  const response = await axiosDriver.patch(
    `/pickup/${pickupReqId}/tracking-status`,
    { trackingStatus }
  );
  console.log("ress", response);

  return response.data;
};
