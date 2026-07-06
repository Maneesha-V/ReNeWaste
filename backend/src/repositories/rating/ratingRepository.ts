import { injectable } from "inversify";
import BaseRepository from "../baseRepository/baseRepository";
import { IRatingRepository } from "./interface/IRatingRepository";
import { RatingModel } from "../../models/rating/ratingModel";
import { AddUserRatingRepoReq, IRatingDocument } from "../../models/rating/interfaces/ratingInterface";
import mongoose from "mongoose";

@injectable()
export class RatingRepository
  extends BaseRepository<IRatingDocument>
  implements IRatingRepository
{
  constructor() {
    super(RatingModel);
  }
  async createRating(payload: AddUserRatingRepoReq, wasteplantId: string) {
    const {
      userId,
      data: { rating, comment },
    } = payload;
    await this.model.create({
      userId,
      wasteplantId,
      rating,
      comment,
    });
    return true;
  }
  async getWPRatingSummary(plantId: string) {
    const result = await this.model.aggregate([
      {
        $match: {
          wasteplantId: new mongoose.Types.ObjectId(plantId),
        },
      },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
              },
            },
          ],
          latestReview: [
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                rating: 1,
                comment: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);
    const summary = result[0].summary[0];
    const latestReview = result[0].latestReview[0];

    return {
      averageRating: summary ? Number(summary.averageRating.toFixed(1)) : 0,
      totalReviews: summary ? summary.totalReviews : 0,
      latestReview: latestReview ?? null,
    };
  }
}
