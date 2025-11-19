import { inject, injectable } from "inversify";
import BaseRepository from "../baseRepository/baseRepository";
import { IRatingRepository } from "./interface/IRatingRepository";
import { RatingModel } from "../../models/rating/ratingModel";
import { IRatingDocument } from "../../models/rating/interfaces/ratingInterface";
import { AddUserRatingReq } from "../../dtos/rating/ratingDTO";

@injectable()
export class RatingRepository
  extends BaseRepository<IRatingDocument>
  implements IRatingRepository
{
  constructor() {
    super(RatingModel);
  }
  async createRating(payload: AddUserRatingReq, wasteplantId: string) {
    const {userId, data:  {rating, comment}} = payload;
    await this.model.create({
        userId,
        wasteplantId,
        rating,
        comment
    });
    return true;
  }
}