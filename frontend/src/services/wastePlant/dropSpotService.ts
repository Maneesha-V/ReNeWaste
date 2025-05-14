import axiosWasteplant from "../../api/axiosWasteplant";

  export const createDropSpotService = async (dropSpotData: any) => {
    try {
      const response = await axiosWasteplant.post(
        `/add-drop-spot`,
        dropSpotData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding drop spot:", error.response?.data || error);
      throw error;
    }
  };
  
  export const fetchDropSpotsService = async () => {
    try {
      const response = await axiosWasteplant.get(`/drop-spots`);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };