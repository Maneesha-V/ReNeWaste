import { axiosUser } from "../../config/axiosClients"
import { API_ROUTES } from "../../constants/apiRoutes";
import { AddRatingReq } from "../../types/rating/ratingTypes"

export const addRatingService = async (data: AddRatingReq) => {
    const response = await axiosUser.post(API_ROUTES.USER.ADD_RATING,{
        data
    });
    return response.data;
}