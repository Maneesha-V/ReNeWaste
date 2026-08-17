import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IRatingService } from "./interface/IRatingService";
import { AddUserRatingReq } from "../../dtos/rating/ratingDTO";
import { IRatingRepository } from "../../repositories/rating/interface/IRatingRepository";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class RatingService implements IRatingService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.RatingRepository)
    private _ratingRepository: IRatingRepository,
  ) {}
  async addUserRating ( payload: AddUserRatingReq): Promise<boolean> {
    const { userId } = payload;
    const user = await this._userRepository.findUserById(userId);
    if (!user || !user.wasteplantId) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.NOT_FOUND,
      );
    }
    const created = await this._ratingRepository.createRating(payload, user.wasteplantId.toString())
    if(!created){
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.COMMON.ERROR.RATING_CREATE_FAILED
      )
    }
    return true;
  }
}