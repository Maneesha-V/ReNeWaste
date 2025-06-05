import axiosDriver from "../../api/axiosDriver";

export const getNotifications = async () => {
  const response = await axiosDriver.get(`/notifications`);
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosDriver.patch(`/notifications/${id}/read`);
  return response.data;
}