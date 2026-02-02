import { inject, injectable } from "inversify";
import {
  IPickupRequest,
  IPickupRequestDocument,
} from "../../models/pickupRequests/interfaces/pickupInterface";
import { IPickupService } from "./interface/IPickupService";
import TYPES from "../../config/inversify/types";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import {
  EnhancedPickup,
  IPickupRepository,
} from "../../repositories/pickupReq/interface/IPickupRepository";
import {
  PickupDriverFilterParams,
  PickupReqDTO,
  PickupReqGetDTO,
} from "../../dtos/pickupReq/pickupReqDTO";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import { MarkPickupCompletedResp } from "../../dtos/driver/driverDTO";
import { UserMapper } from "../../mappers/UserMapper";
import { AddressDTO } from "../../dtos/user/userDTO";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { IAttendanceRepository } from "../../repositories/atendance/interface/IAttendanceRepository";
import mongoose from "mongoose";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
    @inject(TYPES.AttendanceRepository)
    private _attendanceRepository: IAttendanceRepository,
  ) {}
  async getPickupRequestService(
    filters: PickupDriverFilterParams,
  ): Promise<PickupReqGetDTO[]> {
    const result = await this.pickupRepository.getPickupsByDriverId(filters);
    return PickupRequestMapper.mapPickupReqsGetDTO(result);
  }
  async getPickupByIdForDriver(
    pickupReqId: string,
    driverId: string,
  ): Promise<PickupReqGetDTO> {
    const pickup = await this.pickupRepository.findPickupByIdAndDriver(
      pickupReqId,
      driverId,
    );
    console.log("pickup", pickup);
    return PickupRequestMapper.mapGetPickupReqDTO(pickup);
  }
  async updateAddressLatLngService(
    addressId: string,
    latitude: number,
    longitude: number,
  ): Promise<AddressDTO> {
    const updatedUser = await this.userRepository.updateAddressByIdLatLng(
      addressId,
      latitude,
      longitude,
    );
    const updatedAddress = updatedUser.addresses.id(addressId);
    if (!updatedAddress) {
      throw new Error("Updated address not found");
    }
    return UserMapper.mapAddressDTO(updatedAddress);
  }
  async updateTrackingStatus(
    pickupReqId: string,
    trackingStatus: string,
  ): Promise<PickupReqDTO> {
    const pickup = await this.pickupRepository.updateTrackingStatus(
      pickupReqId,
      trackingStatus,
    );
    return PickupRequestMapper.mapPickupReqDTO(pickup);
  }

  // async markPickupCompletedService(
  //   pickupReqId: string,
  // ): Promise<MarkPickupCompletedResp> {
  //   const pickup =
  //     await this.pickupRepository.markPickupCompletedStatus(pickupReqId);
  //   if (!pickup) {
  //     throw new Error("Not mark pickup.");
  //   }

  //   const amount = pickup.payment.amount;
  //   const driverId = pickup.driverId!.toString();
  //   const wasteplantId = pickup.wasteplantId!.toString();

  //   const driverShare = amount * 0.3;
  //   const wasteplantShare = amount * 0.7;

  //   const driverWalet = await this._walletRepository.findWallet(
  //     driverId,
  //     "Driver",
  //   );
  //   if (!driverWalet) {
  //     await this._walletRepository.createDrWpWallet({
  //       accountId: driverId,
  //       accountType: "Driver",
  //       data: {
  //         amount: driverShare,
  //         description: `Reward for completed pickup ${pickup.pickupId}`,
  //         type: "Reward",
  //       },
  //     });
  //   } else {
  //     await this._walletRepository.addMoney({
  //       walletId: driverWalet._id!.toString(),
  //       data: {
  //         amount: driverShare,
  //         description: `Reward for completed pickup ${pickup.pickupId}`,
  //         type: "Reward",
  //       },
  //     });
  //   }
  //   const wasteplantWallet = await this._walletRepository.findWallet(
  //     wasteplantId,
  //     "WastePlant",
  //   );

  //   if (!wasteplantWallet) {
  //     await this._walletRepository.createDrWpWallet({
  //       accountId: wasteplantId,
  //       accountType: "WastePlant",
  //       data: {
  //         amount: wasteplantShare,
  //         type: "Earning",
  //         description: `Earnings from completed pickup ${pickup.pickupId}`,
  //       },
  //     });
  //   } else {
  //     await this._walletRepository.addMoney({
  //       walletId: wasteplantWallet._id.toString(),
  //       data: {
  //         amount: wasteplantShare,
  //         type: "Earning",
  //         description: `Income from completed pickup ${pickup.pickupId}`,
  //       },
  //     });
  //   }

  //   const attendance = await this._attendanceRepository.findDriverAttendance({
  //     truckId: pickup.truckId!.toString(),
  //     plantId: wasteplantId,
  //     driverId,
  //   });
  //   if (!attendance) {
  //     throw new Error("Driver attendance not found.");
  //   }
  //   attendance.totalPickups += 1;
  //   attendance.reward += driverShare;
  //   attendance.earning += wasteplantShare;
  //   await attendance.save();
  //   return {
  //     pickupReqId: pickup._id.toString(),
  //     status: pickup.status,
  //   };
  // }

  async markPickupCompletedService(
    pickupReqId: string,
  ): Promise<MarkPickupCompletedResp> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const pickup = await this.pickupRepository.markPickupCompletedStatus(
        pickupReqId,
        session,
      );
      if (!pickup) {
        throw new Error("Not mark pickup.");
      }

      const amount = pickup.payment.amount;
      const driverId = pickup.driverId!.toString();
      const wasteplantId = pickup.wasteplantId!.toString();

      const driverShare = amount * 0.3;
      const wasteplantShare = amount * 0.7;

      const driverWalet = await this._walletRepository.findWallet(
        driverId,
        "Driver",
        session,
      );
      if (!driverWalet) {
        await this._walletRepository.createDrWpWallet(
          {
            accountId: driverId,
            accountType: "Driver",
            data: {
              amount: driverShare,
              description: `Reward for completed pickup ${pickup.pickupId}`,
              type: "Reward",
            },
          },
          session,
        );
      } else {
        await this._walletRepository.addMoney(
          {
            walletId: driverWalet._id!.toString(),
            data: {
              amount: driverShare,
              description: `Reward for completed pickup ${pickup.pickupId}`,
              type: "Reward",
            },
          },
          session,
        );
      }
      const wasteplantWallet = await this._walletRepository.findWallet(
        wasteplantId,
        "WastePlant",
        session,
      );

      if (!wasteplantWallet) {
        await this._walletRepository.createDrWpWallet(
          {
            accountId: wasteplantId,
            accountType: "WastePlant",
            data: {
              amount: wasteplantShare,
              type: "Earning",
              description: `Earnings from completed pickup ${pickup.pickupId}`,
            },
          },
          session,
        );
      } else {
        await this._walletRepository.addMoney(
          {
            walletId: wasteplantWallet._id.toString(),
            data: {
              amount: wasteplantShare,
              type: "Earning",
              description: `Income from completed pickup ${pickup.pickupId}`,
            },
          },
          session,
        );
      }

      const attendance = await this._attendanceRepository.findDriverAttendance(
        {
          truckId: pickup.truckId!.toString(),
          plantId: wasteplantId,
          driverId,
        },
        session,
      );
      
      if (!attendance) {
        throw new Error("Driver attendance not found.");
      }
      // attendance.totalPickups += 1;
      // attendance.reward += driverShare;
      // attendance.earning += wasteplantShare;
      attendance.totalPickups = (attendance.totalPickups || 0) + 1;
attendance.reward = (attendance.reward || 0) + driverShare;
attendance.wpEarning = (attendance.wpEarning || 0) + wasteplantShare;
      await attendance.save({ session });

      await session.commitTransaction();
      session.endSession();
 console.log("attendance",attendance);
      return {
        pickupReqId: pickup._id.toString(),
        status: pickup.status,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
