import { axiosUser } from "../../config/axiosClients"
import { AddRatingReq } from "../../types/rating/ratingTypes"

export const addRatingService = async (data: AddRatingReq) => {
    const response = await axiosUser.post("/add/rating",{
        data
    });
    return response.data;
}