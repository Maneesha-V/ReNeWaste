import { axiosWasteplant } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";

export const filterReportsService = async (from: string, to: string) => {
    const response = await axiosWasteplant.get(`${API_ROUTES.WASTE_PLANT.WASTE_REPORTS}/from=${from}&to=${to}`);
    console.log("res", response);
    return response.data;
};

export const fetchWasteReportsService = async () => {
    const response = await axiosWasteplant.get(API_ROUTES.WASTE_PLANT.WASTE_REPORTS);
    console.log("res", response);
    return response.data;
};