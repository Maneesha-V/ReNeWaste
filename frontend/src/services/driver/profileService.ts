import { axiosDriver } from "../../config/axiosClients";

export const getDriverProfile = async () => {
    try {
        const response = await axiosDriver.get(`/profile`);
        return response.data;
    } catch (error: any) {
      console.error("err", error);
      throw error.response?.data?.error || "Fetch profile failed.";
    }
  };
  export const updateProfile = async (formData: FormData) => {
    try {

      const response = await axiosDriver.patch(`/edit-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("err", error);
      throw error.response?.data?.error || "Updation failed. Please try again.";
    }
  };
  export const fetchDriversService = async(wastePlantId: string) => {
    const response = await axiosDriver.get(`/drivers?wastePlantId=${wastePlantId}`);
    return response.data;
  }