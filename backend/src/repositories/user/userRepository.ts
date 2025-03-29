import { UserModel } from "../../models/user/userModel";
import { IUser, IUserDocument } from "../../models/user/interfaces/userInterface"
import { OTPModel } from "../../models/user/otpModel";

export const createUser = async (userData: IUser): Promise<IUserDocument> => {
  const user = new UserModel(userData);
  return await user.save();
};

export const findUserByEmail = async (email:string): Promise<IUserDocument | null> => {
  return await UserModel.findOne({email}).exec();
};
export const findUserByEmailGoogleId = async (email:string,googleId:string): Promise<IUserDocument | null> => {
  return await UserModel.findOne({email,googleId}).exec();
}
export const findUserById = async (userId: string) => {
  return await UserModel.findById(userId).select("-password");
};
export const updateUserProfileById = async (userId: string, updatedData: IUser) => {
  return await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
};
export const saveOtp = async (email: string, otp: string): Promise<void> => {
  await OTPModel.create({ email, otp, createdAt: new Date() });
};
export const findOtpByEmail = async (email: string) => {
  return await OTPModel.findOne({ email });
};

export const deleteOtp = async (email: string) => {
  return await OTPModel.deleteOne({ email });
};