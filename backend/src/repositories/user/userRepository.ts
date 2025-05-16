import { UserModel } from "../../models/user/userModel";
import {
  IUser,
  IUserDocument,
} from "../../models/user/interfaces/userInterface";
import { OTPModel } from "../../models/user/otpModel";
import { IUserRepository } from "./interface/IUserRepository";
import { OtpRecord } from "../../types/user/authTypes";
import mongoose from "mongoose";
import { PaginatedUsersResult } from "../../types/wastePlant/userTypes";

class UserRepository implements IUserRepository {
  async createUser(userData: IUser): Promise<IUserDocument> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async findUserByEmailGoogleId(
    email: string,
    googleId: string
  ): Promise<IUserDocument | null> {
    return await UserModel.findOne({ email, googleId }).exec();
  }

  async findUserById(userId: string): Promise<IUserDocument | null> {
    return await UserModel.findById(userId).select("-password");
  }
  async updateUserProfileById(
    userId: string,
    updatedData: IUser
  ): Promise<IUserDocument | null> {
    return await UserModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
  }
  async updatePartialProfileById(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<IUserDocument | null> {
    const updateOps: any = {};

    if (updatedData.phone) {
      updateOps.phone = updatedData.phone;
    }

    if (updatedData.addresses && Array.isArray(updatedData.addresses)) {
      updateOps.$push = {
        addresses: { $each: updatedData.addresses },
      };
    }

    return await UserModel.findByIdAndUpdate(userId, updateOps, { new: true });
  }

  async saveOtp(email: string, otp: string): Promise<void> {
    await OTPModel.create({ email, otp, createdAt: new Date() });
  }
  async reSaveOtp(email: string, otp: string): Promise<void> {
    await OTPModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { new: true, upsert: true }
    );
  }
  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    return await OTPModel.findOne({ email });
  }
  async deleteOtp(email: string): Promise<void> {
    await OTPModel.deleteOne({ email });
  }
  async updateUserPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await UserModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
  }
  async updateAddressByIdLatLng(
    addressId: string,
    latitude: number,
    longitude: number
  ): Promise<any> {
    const updatedUser = await UserModel.findOneAndUpdate(
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

    const updatedAddress = updatedUser.addresses.id(addressId);

    if (!updatedAddress) {
      throw new Error("Updated address not found");
    }

    return updatedAddress;
  }
  async findAddressByAddressId(
    userId: string,
    addressId: string,
    latitude: number,
    longitude: number
  ): Promise<IUser | null> {
    return await UserModel.findOne(
      {
        _id: userId,
        "addresses._id": addressId,
      },
      {
        $set: {
          "addresses.$.latitude": latitude,
          "addresses.$.longitude": longitude,
        },
      }
    );
  }

  async getUsersByWastePlantId(
    wasteplantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedUsersResult> {
    const query = {
      wasteplantId,
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };
    const skip = (page - 1) * limit;

    const users = await UserModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(query);

    return { users, total };
  }
}

export default new UserRepository();
