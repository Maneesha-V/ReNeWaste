export type AddRatingReq = {
    rating: number;
    comment: string;
}
export interface LatestReviewDTO {
  rating: number;
  comment: string;
  createdAt: Date;
}
export interface ServiceRatingSummaryDTO {
  averageRating: number;
  totalReviews: number;
  latestReview: LatestReviewDTO | null;
}