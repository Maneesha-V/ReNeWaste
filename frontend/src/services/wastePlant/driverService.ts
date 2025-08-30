import { axiosWasteplant } from "../../config/axiosClients";
import { PaginationPayload } from "../../types/common/commonTypes"

export const getCreateDriverService = async () => {
    try {
      const response = await axiosWasteplant.get(`/add-driver`);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };
  
export const getDrivers = async ({ page, limit, search }: PaginationPayload) => {
    try {
      const response = await axiosWasteplant.get(`/drivers`,{
        params: { page, limit, search },
      });
      return response.data;
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
            "Content-Type": undefined,
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
              "Content-Type": undefined,
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
      console.log("response",response);
      
      return response.data;
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  };