import { UserModel } from "../../models/user/userModel";
import { IUser, IUserDocument } from "../../models/user/interfaces/userInterface";
import { OTPModel } from "../../models/user/otpModel";
import { IUserRepository } from "./interface/IUserRepository";
import { OtpRecord } from "../../types/user/authTypes";

class UserRepository implements IUserRepository {
  async createUser(userData: IUser): Promise<IUserDocument> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async findUserByEmailGoogleId(email: string, googleId: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ email, googleId }).exec();
  }

  async findUserById(userId: string): Promise<IUserDocument | null> {
    return await UserModel.findById(userId).select("-password");
  }
  async updateUserProfileById(userId: string, updatedData: IUser): Promise<IUserDocument | null> {
    return await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
  }

  async saveOtp(email: string, otp: string): Promise<void> {
    await OTPModel.create({ email, otp, createdAt: new Date() });
  }
  async reSaveOtp(email: string, otp: string): Promise<void> {
    await OTPModel.findOneAndUpdate(
      { email }, 
      { otp, createdAt: new Date() },
      { new: true, upsert: true }
    )
  }
  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    return await OTPModel.findOne({ email });
  }
  async deleteOtp(email: string): Promise<void> {
    await OTPModel.deleteOne({ email });
  }
  async updateUserPassword(email: string, hashedPassword: string): Promise<void> {
    await UserModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false } // Prevents validation errors
    );
  }
}

export default new UserRepository();
