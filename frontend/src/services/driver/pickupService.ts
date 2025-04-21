import axios from "axios";

const API_URL = import.meta.env.VITE_DRIVER_API_URL;

export const getDriverPickups = async (
  wasteType: "Residential" | "Commercial") => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/alloted-pickups?wasteType=${wasteType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
  };

export const markPickupService = async(pickupReqId: string) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/pickup-complete/${pickupReqId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data; 
}
export const fetchPickupByIdService = async(pickupReqId: string) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/track-pickup/${pickupReqId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
}
export const fetchEtaService = async({ origin, destination, pickupReqId }: { origin: string; destination: string; pickupReqId: string }) => {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}/maps/eta?origin=${origin}&destination=${encodeURIComponent(destination)}/&pickupReqId=${pickupReqId}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}