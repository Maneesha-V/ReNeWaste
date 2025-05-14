import axiosUser from "../../api/axiosUser";

  export const fetchDropSpotsService = async () => {
    try {
      const response = await axiosUser.get(`/drop-spots`);
      return response.data.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };