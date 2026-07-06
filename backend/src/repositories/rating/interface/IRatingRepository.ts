import { AddUserRatingRepoReq, GetWPRatingSummaryRepoResp } from "../../../models/rating/interfaces/ratingInterface";

export interface IRatingRepository {
    createRating(payload: AddUserRatingRepoReq, wasteplantId: string): Promise<boolean>;
    getWPRatingSummary(plantId: string): Promise<GetWPRatingSummaryRepoResp>;
}