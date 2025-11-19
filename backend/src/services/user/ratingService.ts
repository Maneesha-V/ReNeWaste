import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { IRatingService } from "./interface/IRatingService";
import { AddUserRatingReq } from "../../dtos/rating/ratingDTO";
import { IRatingRepository } from "../../repositories/rating/interface/IRatingRepository";

@injectable()
export class RatingService implements IRatingService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.RatingRepository)
    private _ratingRepository: IRatingRepository,
  ) {}
  async addUserRating ( payload: AddUserRatingReq): Promise<boolean> {
    const { userId } = payload;
    const user = await this._userRepository.findUserById(userId);
    if(!user || !user.wasteplantId) throw new Error("User not found.")
    const created = await this._ratingRepository.createRating(payload, user.wasteplantId.toString())
    if(!created){
      throw new Error("Can't write user rating.")
    }
    return true;
  }
}