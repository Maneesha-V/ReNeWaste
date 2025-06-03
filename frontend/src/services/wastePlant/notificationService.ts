import axiosWasteplant from "../../api/axiosWasteplant";

export const getNotifications = async () => {
  const response = await axiosWasteplant.get(`/notifications`);
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosWasteplant.patch(`/notifications/${id}/read`);
  return response.data;
}