import { UserModel } from "../../models/user/userModel";
import {
  IUser,
  IUserDocument,
} from "../../models/user/interfaces/userInterface";
import { IUserRepository } from "./interface/IUserRepository";
import BaseRepository from "../baseRepository/baseRepository";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IOtpRepository } from "../otp/interface/IOtpRepository";
import { FilterQuery, Types, UpdateQuery } from "mongoose";
import { PaginatedUsersResult, UserDTO } from "../../dtos/user/userDTO";
import { OtpRecord } from "../../dtos/user/otpDTO";

@injectable()
export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor(
    @inject(TYPES.OtpRepository)
    private otpRepository: IOtpRepository
  ) {
    super(UserModel);
  }
  async createUser(userData: IUser): Promise<IUserDocument> {
    const user = new this.model(userData);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return await this.model.findOne({ email }).exec();
  }

  async findUserByEmailGoogleId(
    email: string,
    googleId: string
  ): Promise<IUserDocument | null> {
    return await this.model.findOne({ email, googleId }).exec();
  }

  async findUserById(userId: string): Promise<IUserDocument | null> {
    return await this.model.findById(userId).select("-password");
  }
  async updateUserProfileById(
    userId: string,
    updatedData: UserDTO
  ): Promise<IUserDocument | null> {
    return await this.model.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
  }
  async updatePartialProfileById(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<IUserDocument | null> {
    console.log("updatedData", updatedData);

    const updateOps: UpdateQuery<IUserDocument> = {};

    if (updatedData.phone) {
      updateOps.phone = updatedData.phone;
    }

    if (updatedData.addresses && Array.isArray(updatedData.addresses)) {
      updateOps.$push = {
        addresses: { $each: updatedData.addresses },
      };
    }

    return await this.model.findByIdAndUpdate(userId, updateOps, { new: true });
  }

  async saveOtp(email: string, otp: string): Promise<void> {
    await this.otpRepository.saveOtp(email, otp);
  }
  async reSaveOtp(email: string, otp: string): Promise<void> {
    await this.otpRepository.reSaveOtp(email, otp);
  }
  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    return await this.otpRepository.findOtpByEmail(email);
  }
  async deleteOtp(email: string): Promise<void> {
    await this.otpRepository.deleteOtp(email);
  }
  async updateUserPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await this.model.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
  }
  async updateAddressByIdLatLng(
    addressId: string,
    latitude: number,
    longitude: number
  ): Promise<IUserDocument> {
    const updatedUser = await this.model.findOneAndUpdate(
      { "addresses._id": addressId },
      {
        $set: {
          "addresses.$.latitude": latitude,
          "addresses.$.longitude": longitude,
        },
      },
      {
        new: true,
        projection: { addresses: 1 },
      }
    );

    if (!updatedUser) {
      throw new Error("Address not found");
    }

    return updatedUser;
  }
  async findAddressByAddressId(
    userId: string,
    addressId: string,
    latitude: number,
    longitude: number
  ): Promise<IUser | null> {
    return await this.model.findOneAndUpdate(
      {
        _id: userId,
        "addresses._id": addressId,
      },
      {
        $set: {
          "addresses.$.latitude": latitude,
          "addresses.$.longitude": longitude,
        },
      },
      { new: true, projection: { addresses: 1 } }
    );
  }

  async getUsersByWastePlantId(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedUsersResult> {
    const searchTerms = search.trim().split(" ").filter(Boolean);

    let query: FilterQuery<IUserDocument> = { wasteplantId };
    if (searchTerms.length) {
      query.$or = [
        {
          $and: searchTerms.map((term) => ({
            $or: [
              { firstName: { $regex: term, $options: "i" } },
              { lastName: { $regex: term, $options: "i" } },
            ],
          })),
        },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;

    const users = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(query);
    console.log("users", users);

    return { users, total };
  }
  async fetchAllUsersByPlantId(plantId: string) {
    const objectId = new Types.ObjectId(plantId);
    const totalCount = await this.model.countDocuments({
      wasteplantId: objectId,
    });
    return totalCount;
  }
}
