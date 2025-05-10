import axiosWasteplant from "../../api/axiosWasteplant";

export const getTrucks = async () => {
  try {
    const response = await axiosWasteplant.get(`/trucks`);
    console.log("res", response);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const getAvailableTrucks = async (driverId: string) => {
  try {
    const response = await axiosWasteplant.get(
      `/available-trucks?driverId=${driverId}`
    );
    console.log("res", response);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const createTruck = async (truckData: FormData) => {
  try {
    const response = await axiosWasteplant.post(`/add-truck`, truckData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding truck:", error.response?.data || error);
    throw error;
  }
};
export const getTruckById = async (truckId: string) => {
  try {
    const response = await axiosWasteplant.get(`/edit-truck/${truckId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const updateTruckById = async (truckId: string, data: FormData) => {
  try {
    const response = await axiosWasteplant.patch(
      `/edit-truck/${truckId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};
export const deleteTruckById = async (truckId: string) => {
  try {
    const response = await axiosWasteplant.delete(`/delete-truck/${truckId}`);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};
export const getTruckRequests = async () => {
  try {
    const response = await axiosWasteplant.get(`/pending-truck-req`);
    console.log("res", response);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};

export const getTrucksForDriver = async () => {
  try {
    const response = await axiosWasteplant.get(`/trucks-for-driver`);
    console.log("res", response);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};

export const assignTruckForDriver = async (
  driverId: string,
  truckId: string,
  prevTruckId: string
) => {
  try {
    const response = await axiosWasteplant.post(`/assign-truck`, {
      driverId,
      truckId,
      prevTruckId
    });
    console.log("res-assign", response);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
