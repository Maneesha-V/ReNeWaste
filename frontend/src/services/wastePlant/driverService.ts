import axiosWasteplant from "../../api/axiosWasteplant";

export const getDrivers = async () => {
    try {
      const response = await axiosWasteplant.get(`/drivers`);
      console.log("res", response);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  export const createDriver = async (driverData: FormData) => {
    try {
      const response = await axiosWasteplant.post(
        `/add-driver`,
        driverData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding driver:", error.response?.data || error);
      throw error;
    }
  };
  export const getDriverById = async (driverId: string) => {
    try {
      const response = await axiosWasteplant.get(`/edit-driver/${driverId}`);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  export const updateDriverById = async (driverId: string, data: FormData) => {
    try {
      const response = await axiosWasteplant.patch(`/edit-driver/${driverId}`, data, 
        {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
      );
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };
  export const deleteDriverById = async (driverId: string) => {
    try {
      const response = await axiosWasteplant.delete(`/delete-driver/${driverId}`);
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };