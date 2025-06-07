import axiosUser from "../../api/axiosUser";

export const getNotifications = async () => {
  const response = await axiosUser.get(`/notifications`);
  console.log("response",response);
  
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosUser.patch(`/notifications/${id}/read`);
  return response.data;
}
