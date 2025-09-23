import { PaginatedUsersResult, UserDTO } from "../../../dtos/user/userDTO";
import { IUser, IUserDocument } from "../../../models/user/interfaces/userInterface";
import { OtpRecord } from "../../../types/user/authTypes";
import IBaseRepository from "../../baseRepository/interface/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUserDocument> {
  createUser(userData: IUser): Promise<IUserDocument>;
  findUserByEmail(email: string): Promise<IUserDocument | null>;
  findUserByEmailGoogleId(email: string, googleId: string): Promise<IUserDocument | null>;
  findUserById(userId: string): Promise<IUserDocument | null>;
  updateUserProfileById(userId: string, updatedData: UserDTO): Promise<IUserDocument | null>;
  updatePartialProfileById(userId: string, updatedData: Partial<IUser>): Promise<IUserDocument | null>;
  saveOtp(email: string, otp: string): Promise<void>;
  reSaveOtp(email: string, otp: string): Promise<void>;
  findOtpByEmail(email: string): Promise<OtpRecord | null>;
  deleteOtp(email: string): Promise<void>;
  updateUserPassword(email: string, hashedPassword: string): Promise<void>;
  updateAddressByIdLatLng(addressId: string, latitude: number, longitude: number): Promise<IUserDocument>;
  findAddressByAddressId(userId: string, addressId: string, latitude: number, longitude: number): Promise<IUser | null>;
  getUsersByWastePlantId(wasteplantId: string, page: number, limit: number, search: string): Promise<PaginatedUsersResult>;
  fetchAllUsersByPlantId(plantId: string): Promise<number>;
}
