import { IUser, IUserDocument } from "../../../models/user/interfaces/userInterface";

export interface IUserRepository {
  createUser(userData: IUser): Promise<IUserDocument>;
  findUserByEmail(email: string): Promise<IUserDocument | null>;
  findUserByEmailGoogleId(email: string, googleId: string): Promise<IUserDocument | null>;
  findUserById(userId: string): Promise<IUserDocument | null>;
  updateUserProfileById(userId: string, updatedData: IUser): Promise<IUserDocument | null>;
  updatePartialProfileById(userId: string, updatedData: Partial<IUser>): Promise<IUserDocument | null>;
  saveOtp(email: string, otp: string): Promise<void>;
  reSaveOtp(email: string, otp: string): Promise<void>;
  findOtpByEmail(email: string): Promise<{ email: string; otp: string } | null>;
  deleteOtp(email: string): Promise<void>;
  updateUserPassword(email: string, hashedPassword: string): Promise<void>;
}
