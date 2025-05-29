import axiosWasteplant from "../../api/axiosWasteplant";

  export const getDashboard = async () => {
    const response = await axiosWasteplant.get(`/dashboard`);
    return response.data;
  };