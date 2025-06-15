import axiosDriver from "../../api/axiosDriver";

export const getDriverPickups = async (
  wasteType: "Residential" | "Commercial"
) => {
  const response = await axiosDriver.get(
    `/alloted-pickups?wasteType=${wasteType}`
  );
  return response.data.data;
};

export const markPickupService = async (pickupReqId: string) => {
  const response = await axiosDriver.put(`/pickup-complete/${pickupReqId}`);
  return response.data.data;
};
export const fetchPickupByIdService = async (pickupReqId: string) => {
  const response = await axiosDriver.get(`/track-pickup/${pickupReqId}`);
  return response.data.data;
};
export const fetchEtaService = async ({
  origin,
  destination,
  pickupReqId,
  addressId,
}: {
  origin: string;
  destination: string;
  pickupReqId: string;
  addressId: string;
}) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}/maps/eta?origin=${origin}&destination=${encodeURIComponent(
    destination
  )}&pickupReqId=${pickupReqId}&addressId=${addressId}`;
  const response = await axiosDriver.get(url);
  return response.data.data;
};
export const updateAddressLatLngService = async ({
  addressId,
  latitude,
  longitude,
}: {
  addressId: string;
  latitude: number;
  longitude: number;
}) => {
  const response = await axiosDriver.patch(`/address/${addressId}/location`, {
    latitude,
    longitude,
  });
  return response.data.data;
};

export const updateTrackingStatusService = async ({
  pickupReqId,
  trackingStatus,
}: {
  pickupReqId: string;
  trackingStatus: string;
}) => {
  const response = await axiosDriver.patch(
    `/pickup/${pickupReqId}/tracking-status`,
    { trackingStatus }
  );
  console.log("ress", response);

  return response.data.data;
};
