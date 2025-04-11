import { IPickupRequestResidentialDocument } from "../../models/pickupResidential/interfaces/pickupResInterface";
import { IUserDocument } from "../../models/user/interfaces/userInterface";
import UserRepository from "../../repositories/user/userRepository";
import PickupResidentialRepository from "../../repositories/pickupResidential/pickupResRepository";
import { IResidentialService } from "./interface/IResidentialService";
import { Types } from "mongoose";
import { IAddress } from "../../models/user/interfaces/addressInterface";


class ResidentialService implements IResidentialService {
  async getResidentialService(userId: string) {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateResidentialPickupService(userId: string, updatedData: any) {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = await UserRepository.updatePartialProfileById(userId, updatedData);
    if (!updatedUser) throw new Error("User update failed");
  const addressList = updatedUser.addresses;
  const latestAddress = addressList[addressList.length - 1] as IAddress & { _id: Types.ObjectId };
  console.log("latestAddress",latestAddress);
  
  if (!latestAddress || !latestAddress._id) throw new Error("Address ID not found");
  // const addressId = latestAddress?._id;
  // if (!addressId) throw new Error("Address ID not found");
  const newPickuData ={
    userId: new Types.ObjectId(userId),
    addressId: new Types.ObjectId(latestAddress._id),
    wasteType: updatedData.wasteType,
    originalPickupDate: updatedData.pickupDate,
    pickupTime: updatedData.pickupTime,
    status: "Pending", 
  }
  const newPickupReq: IPickupRequestResidentialDocument = await PickupResidentialRepository.createPickup(newPickuData);
  return { user: updatedUser, pickupRequest: newPickupReq };

  }

}
export default new ResidentialService();