import { AddUserRatingReq } from "../../../dtos/rating/ratingDTO";

export interface IRatingService {
    addUserRating ( payload: AddUserRatingReq): Promise<boolean>;
}