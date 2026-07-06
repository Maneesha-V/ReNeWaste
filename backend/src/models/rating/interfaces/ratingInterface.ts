import mongoose, { HydratedDocument, Types } from "mongoose";

export interface IRating {
  userId: mongoose.Types.ObjectId;
  wasteplantId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
}
// export interface IRatingDocument extends IRating, Document {
//   _id: Types.ObjectId;
// }
export type IRatingDocument = HydratedDocument<IRating>;

export type AddUserRatingRepoReq = {
    userId: string;
    data: {
        rating: number;
        comment?: string;
    }
}

export interface LatestReview {
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface GetWPRatingSummaryRepoResp {
  averageRating: number;
  totalReviews: number;
  latestReview: LatestReview | null;
}