import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ITruckController } from "./interface/ITruckController";
import { ITruck } from "../../models/truck/interfaces/truckInterface";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckService } from "../../services/wastePlant/interface/ITruckService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class TruckController implements ITruckController {
  constructor(
    @inject(TYPES.PlantTruckService)
    private truckService: ITruckService,
  ) {}
  async addTruck(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      console.log("plantId", plantId);
      console.log("body", req.body);

      const truckData: ITruck = {
        ...req.body,
        capacity: Number(req.body.capacity),
        tareWeight: Number(req.body.tareWeight),
        wasteplantId: new mongoose.Types.ObjectId(plantId),
      };

      const newTruck = await this.truckService.addTruck(truckData);
      console.log("✅ Inserted Truck:", newTruck);
      if (newTruck) {
        res.status(STATUS_CODES.CREATED).json({
          success: true,
          message: MESSAGES.WASTEPLANT.SUCCESS.CRETAE_TRUCK,
        });
      }
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }

  async fetchTrucks(
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { trucks, total } = await this.truckService.getAllTrucks(
        plantId,
        page,
        limit,
        search,
      );
      console.log("trucks", trucks);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK,
        trucks,
        total,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async fetchAvailableTrucks(
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
      const { driverId } = req.query;
      if (typeof driverId !== "string") {
        res.status(400).json({ message: "Invalid or missing driverId" });
        return;
      }

      const trucks = await this.truckService.getAvailableTrucksService(
        driverId,
        plantId,
      );
      console.log("trucks", trucks);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK,
        trucks,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async getTruckById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { truckId } = req.params;
      const truck = await this.truckService.getTruckByIdService(truckId);
      if (!truck) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED,
        );
      }

      res.status(STATUS_CODES.SUCCESS).json({ truck });
    } catch (error) {
      console.error("Error fetching truck:", error);
      next(error);
    }
  }

  async updateTruck(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { truckId } = req.params;
      if (!truckId) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED,
        );
      }
      const updatedData = req.body;

      if (updatedData.capacity) {
        updatedData.capacity = Number(updatedData.capacity);
      }
      const updatedTruck = await this.truckService.updateTruckByIdService(
        truckId,
        updatedData,
      );

      if (!updatedTruck) {
        res.status(404).json({ message: "Truck not found" });
        return;
      }
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.TRUCK_UPDATE,
        updatedTruck,
      });
    } catch (error) {
      console.error("Error updating truck:", error);
      next(error);
    }
  }

  async deleteTruckById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { truckId } = req.params;
      if (!truckId) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED,
        );
      }
      const updatedTruck =
        await this.truckService.deleteTruckByIdService(truckId);

      console.log("updatedTruck", updatedTruck);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        updatedTruck,
        message: MESSAGES.WASTEPLANT.SUCCESS.TRUCK_DELETE,
      });
    } catch (error) {
      console.error("Error in deleting truck:", error);
      next(error);
    }
  }
  async getAvailableTruckReqsts(
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
      const pendingTruckReqsts =
        await this.truckService.pendingTruckReqsts(plantId);
      console.log("pendingTruckReqsts", pendingTruckReqsts);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK_REQ,
        pendingTruckReqsts,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }

  async getTrucksForDriver(
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
      const availableTrucks =
        await this.truckService.availableTrucksForDriver(plantId);
      console.log("availableTrucks", availableTrucks);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_TRUCK,
        availableTrucks,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async assignTruckToDriver(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      const { driverId, truckId, prevTruckId } = req.body;
      console.log("plantId", plantId);
      console.log(req.body);

      if (!plantId || !driverId || !truckId || !prevTruckId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.MISSING_FIELDS,
        );
      }

      const updatedRequests =
        await this.truckService.assignTruckToDriverService(
          plantId,
          driverId,
          truckId,
          prevTruckId,
        );
      console.log("updatedRequest", updatedRequests);

      res.status(200).json({
        updatedRequests,
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.ASSIGN_TRUCK_DRIVER,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}
