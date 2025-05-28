import axiosWasteplant from "../../api/axiosWasteplant";

  export const getDashboard = async () => {
  const response = await axiosWasteplant.post(`/dashboard`);
    return response.data.messages;
  };