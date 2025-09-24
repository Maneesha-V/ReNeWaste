import { NextFunction, Request, Response } from "express";
import { IDriverController } from "./interface/IDriverController";
import { IDriver } from "../../models/driver/interfaces/driverInterface";
import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverService } from "../../services/wastePlant/interface/IDriverService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class DriverController implements IDriverController {
  constructor(
    @inject(TYPES.PlantDriverService)
    private _driverService: IDriverService,
  ) {}

  async getCreateDriver(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const data = await this._driverService.getTalukByPlantIdService(plantId);

      res.status(STATUS_CODES.SUCCESS).json({
        data,
        success: true,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async addDriver(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      console.log("plantId", plantId);
      console.log("body", req.body);
      const { files } = req as any;
      console.log("files", files);
      if (!files?.licenseFront || !files?.licenseBack) {
        res
          .status(400)
          .json({ error: "Both license front and back images are required" });
        return;
      }

      const licenseFrontPath = files.licenseFront[0].path;
      const licenseBackPath = files.licenseBack[0].path;
      const driverData: IDriver = {
        ...req.body,
        licenseNumber: req.body.licenseNumber?.trim(),
        experience: Number(req.body.experience),
        licenseFront: licenseFrontPath,
        licenseBack: licenseBackPath,
        wasteplantId: new mongoose.Types.ObjectId(plantId),
      };
      console.log("driver", driverData);

      const newDriver = await this._driverService.addDriver(driverData);
      console.log("✅ Inserted Driver:", newDriver);
      if (newDriver) {
        res.status(STATUS_CODES.CREATED).json({
          success: true,
          message: MESSAGES.DRIVER.SUCCESS.CREATE_DRIVER,
        });
      }
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }

  async fetchDrivers(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      if (!plantId) {
        res.status(404).json({ message: "plantId not found" });
        return;
      }
      console.log(req.query);
      const DEFAULT_LIMIT = 5;
      const MAX_LIMIT = 50;
      const page = parseInt(req.query.page as string) || 1;
      let limit = Math.min(
        parseInt(req.query.limit as string) || DEFAULT_LIMIT,
        MAX_LIMIT,
      );
      const search = (req.query.search as string) || "";

      const { drivers, total } = await this._driverService.getAllDrivers(
        plantId,
        page,
        limit,
        search,
      );
      console.log("drivers", drivers, total);

      res.status(200).json({
        success: true,
        message: MESSAGES.DRIVER.SUCCESS.FETCH_DRIVER,
        drivers,
        total,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async getDriverById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const { driverId } = req.params;

      const driver = await this._driverService.getDriverByIdService(
        driverId,
        plantId,
      );
      console.log("driver", driver);

      res.status(200).json({ data: driver });
    } catch (error) {
      console.error("Error fetching Driver:", error);
      next(error);
    }
  }
  async updateDriver(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("body", req.body);

      const { driverId } = req.params;
      const { files } = req as any;
      if (!driverId) {
        res.status(400).json({ message: "Driver ID is required" });
        return;
      }
      const updatedData = req.body;
      if (files?.licenseFront) {
        updatedData.licenseFront = files.licenseFront[0].path;
      }

      if (files?.licenseBack) {
        updatedData.licenseBack = files.licenseBack[0].path;
      }

      if (updatedData.experience) {
        updatedData.experience = Number(updatedData.experience);
      }
      const updatedDriver = await this._driverService.updateDriverByIdService(
        driverId,
        updatedData,
      );

      res.status(200).json({
        success: true,
        message: MESSAGES.DRIVER.SUCCESS.UPDATE_DRIVER,
        data: updatedDriver,
      });
    } catch (error) {
      console.error("Error updating driver:", error);
      next(error);
    }
  }
  async deleteDriverById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { driverId } = req.params;
      const updatedDriver =
        await this._driverService.deleteDriverByIdService(driverId);

      if (!updatedDriver) {
        res.status(404).json({ message: "Driver not found" });
        return;
      }

      res.status(200).json({
        updatedDriver,
        message: MESSAGES.DRIVER.SUCCESS.DELETE_DRIVER,
      });
    } catch (error) {
      console.error("Error in deleting driver:", error);
      next(error);
    }
  }
}
