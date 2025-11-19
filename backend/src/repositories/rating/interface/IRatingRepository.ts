import { AddUserRatingReq } from "../../../dtos/rating/ratingDTO";
import { IRatingDocument } from "../../../models/rating/interfaces/ratingInterface";

export interface IRatingRepository {
    createRating(payload: AddUserRatingReq, wasteplantId: string): Promise<boolean>;
}