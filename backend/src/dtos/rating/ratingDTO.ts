export type AddUserRatingReq = {
    userId: string;
    data: {
        rating: number;
        comment?: string;
    }
}
export interface LatestReviewDTO {
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface GetWPRatingSummaryResp {
  averageRating: number;
  totalReviews: number;
  latestReview: LatestReviewDTO | null;
}
