import UserRepository from "../../repositories/user/userRepository";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import { ICommercialService } from "./interface/ICommercialService";
import { Types } from "mongoose";
import { IAddress } from "../../models/user/interfaces/addressInterface";
import WastePlantRepository from "../../repositories/wastePlant/wastePlantRepository";
import { IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";


class CommercialService implements ICommercialService {
  async getCommercialService(userId: string) {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
  async availableWasteService(service: string, wasteplantId: string):Promise<boolean> {
    const wasteplant = await WastePlantRepository.getWastePlantById(wasteplantId);
    if (!wasteplant || !Array.isArray(wasteplant.services)) return false;

    return wasteplant.services.includes(service);
    
  }
  async updateCommercialPickupService(userId: string, updatedData: any) {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = await UserRepository.updatePartialProfileById(
      userId,
      updatedData
    );
    if (!updatedUser) throw new Error("User update failed");
    const addressList = updatedUser.addresses;
    const latestAddress = addressList[addressList.length - 1] as IAddress & {
      _id: Types.ObjectId;
    };
    console.log("latestAddress", latestAddress);

    if (!latestAddress || !latestAddress._id)
      throw new Error("Address ID not found");
    
    const newPickuData = {
      userId: new Types.ObjectId(userId),
      wasteplantId: user?.wasteplantId,
      addressId: new Types.ObjectId(latestAddress._id),
      wasteType: updatedData.wasteType,
      originalPickupDate: updatedData.pickupDate,
      pickupTime: updatedData.pickupTime,
      service: updatedData.service,
      businessName: updatedData.businessName,
      frequency:updatedData.frequency,
      status: "Pending",
    };
    const newPickupReq: IPickupRequestDocument =
      await PickupRepository.createPickup(newPickuData);
    return { user: updatedUser, pickupRequest: newPickupReq };
  }
}
export default new CommercialService();
