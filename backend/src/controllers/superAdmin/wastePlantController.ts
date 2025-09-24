import { NextFunction, Request, Response } from "express";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { IWastePlantController } from "./interface/IWastePlantController";
import TYPES from "../../config/inversify/types";
import { inject, injectable } from "inversify";
import { IWastePlantService } from "../../services/superAdmin/interface/IWastePlantService";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";
import axios from "axios";
import {
  IndiaPostAPIResponse,
  PostOfficeEntry,
} from "../../dtos/wasteplant/WasteplantDTO";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { ISubscriptionService } from "../../services/superAdmin/interface/ISubscriptionService";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class WastePlantController implements IWastePlantController {
  constructor(
    @inject(TYPES.SuperAdminPlantService)
    private _wastePlantService: IWastePlantService,
    @inject(TYPES.SuperAdminSubscriptionService)
    private subscriptionService: ISubscriptionService,
  ) {}
  async getAddWastePlant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const subscriptionPlans =
        await this.subscriptionService.fetchActiveSubscriptionPlans();
      console.log("subscriptionPlans", subscriptionPlans);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUPERADMIN.SUCCESS.ADD_WASTEPLANT,
        subscriptionPlans,
      });
    } catch (error) {
      next(error);
    }
  }
  async addWastePlant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("file", req.file);

      if (!req.file) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.WASTEPLANT.ERROR.DOCUMENT_REQUIRED,
        );
      }
      if (req.file.mimetype !== "application/pdf") {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.WASTEPLANT.ERROR.PDF_FILES_REQUIRED,
        );
      }

      const uploadFromBuffer = (): Promise<any> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "waste-plants/licenses",
              resource_type: "raw",
              upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            },
          );
          streamifier.createReadStream(req.file!.buffer).pipe(stream);
        });
      };

      const uploadResult = await uploadFromBuffer();
      const fileUrl = uploadResult.secure_url;
      const publicId = uploadResult.public_id;

      let services: string[] = [];
      const rawServices = req.body.services;

      if (Array.isArray(rawServices)) {
        services = rawServices.flatMap((s) =>
          typeof s === "string" ? s.split(",").map((item) => item.trim()) : [],
        );
      } else if (typeof rawServices === "string") {
        services = rawServices.split(",").map((item) => item.trim());
      }

      const wastePlantData: IWastePlant = {
        ...req.body,
        district: "Malappuram",
        taluk: req.body.taluk,
        pincode: req.body.pincode,
        capacity: Number(req.body.capacity),
        services,
        licenseDocumentPath: fileUrl,
        cloudinaryPublicId: publicId,
      } as IWastePlant;

      const newWastePlant =
        await this._wastePlantService.addWastePlant(wastePlantData);
      console.log("✅ Inserted Waste Plant:", newWastePlant);
      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.CREATED,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async viewLicenseDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const publicId = req.params.publicId;

      const fileUrl = cloudinary.url(publicId, {
        resource_type: "raw",
        secure: true,
      });

      const response = await axios.get(fileUrl, { responseType: "stream" });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      response.data.pipe(res);
    } catch (error) {
      console.error("Error while fetching license document:", error);
      next(error);
    }
  }
  async fetchPostOffices(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { pincode } = req.params;
    console.log("pincode", pincode);

    try {
      const response = await axios.get<IndiaPostAPIResponse[]>(
        `https://api.postalpincode.in/pincode/${pincode}`,
        {
          maxRedirects: 5,
        },
      );

      const result = response.data[0];
      console.log("API raw result:", result);

      if (result.Status !== "Success" || !result.PostOffice) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.POST_OFFICE_ERROR,
        );
      }
      console.log("postOffices", result.PostOffice);
      const isMalappuram = result.PostOffice.some(
        (po: PostOfficeEntry) => po.District.toLowerCase() === "malappuram",
      );
      if (!isMalappuram) {
        throw new ApiError(
          STATUS_CODES.FORBIDDEN,
          MESSAGES.COMMON.ERROR.PINCODE_ALLOW_ERROR,
        );
      }
      const postOffices = result.PostOffice.map((po: PostOfficeEntry) => ({
        name: po.Name,
        taluk: po.Taluk || po.SubDivision || po.Block || po.Division || "",
      }));

      res.status(STATUS_CODES.SUCCESS).json(postOffices);
    } catch (error) {
      console.error("Error fetching post office data:", error);
      next(error);
    }
  }
  async fetchWastePlants(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log(req.query);
      const DEFAULT_LIMIT = 5;
      const MAX_LIMIT = 50;
      const page = parseInt(req.query.page as string) || 1;
      let limit = Math.min(
        parseInt(req.query.limit as string) || DEFAULT_LIMIT,
        MAX_LIMIT,
      );
      const search = (req.query.search as string) || "";

      const capacityRangeStr = req.query.capacityRange as string;
      let minCapacity = 0;
      let maxCapacity = Infinity;

      if (capacityRangeStr) {
        const [minStr, maxStr] = capacityRangeStr.split("-");
        minCapacity = parseInt(minStr);
        maxCapacity = parseInt(maxStr);
      }

      const { total, wasteplants } =
        await this._wastePlantService.getAllWastePlants({
          page,
          limit,
          search,
          minCapacity,
          maxCapacity,
        });

      console.log({ total, wasteplants });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH,
        wasteplants,
        total,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async getWastePlantById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED,
        );
      }
      const wastePlant =
        await this._wastePlantService.getWastePlantByIdService(id);
      console.log("wastePlant", wastePlant);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        wastePlant,
      });
    } catch (error) {
      console.error("Error fetching waste plant:", error);
      next(error);
    }
  }
  async updateWastePlant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const updatedData = req.body;
      if (req.file) {
        if (req.file.mimetype !== "application/pdf") {
          throw new ApiError(
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.WASTEPLANT.ERROR.PDF_FILES_REQUIRED,
          );
        }
        const uploadFromBuffer = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "waste-plants/licenses",
                resource_type: "raw",
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              },
            );
            streamifier.createReadStream(req.file!.buffer).pipe(stream);
          });
        };

        const uploadResult = await uploadFromBuffer();
        updatedData.licenseDocumentPath = uploadResult.secure_url;
        updatedData.cloudinaryPublicId = uploadResult.public_id;
      }
      if (updatedData.capacity) {
        updatedData.capacity = Number(updatedData.capacity);
      }
      const rawServices = req.body.services;

      if (Array.isArray(rawServices)) {
        updatedData.services = rawServices.flatMap((s) =>
          typeof s === "string" ? s.split(",").map((item) => item.trim()) : [],
        );
      } else if (typeof rawServices === "string") {
        updatedData.services = rawServices
          .split(",")
          .map((item) => item.trim());
      }
      const updatedWastePlant =
        await this._wastePlantService.updateWastePlantByIdService(
          id,
          updatedData,
        );
      console.log("wastePlant", updatedWastePlant);
      if (!updatedWastePlant) {
        res.status(STATUS_CODES.SERVER_ERROR).json({
          message: MESSAGES.WASTEPLANT.ERROR.FAILED,
        });
      } else {
        res.status(STATUS_CODES.SUCCESS).json({
          message: MESSAGES.WASTEPLANT.SUCCESS.UPDATED,
        });
      }
    } catch (error) {
      console.error("Error updating waste plant:", error);
      next(error);
    }
  }
  async deleteWastePlantById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED,
        );
      }
      const updatedPlant =
        await this._wastePlantService.deleteWastePlantByIdService(id);

      if (!updatedPlant) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
        );
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        updatedPlant,
        message: MESSAGES.WASTEPLANT.SUCCESS.DELETED,
      });
    } catch (error) {
      console.error("Error in deleting waste plant:", error);
      next(error);
    }
  }
  // async sendSubscribeNotification(
  //   req: AuthRequest,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const adminId = req.user?.id;
  //     if (!adminId) {
  //        throw new ApiError(
  //         STATUS_CODES.UNAUTHORIZED,
  //         MESSAGES.COMMON.ERROR.UNAUTHORIZED
  //       );
  //     }
  //     const plantId = req.params.id;
  //     await this._wastePlantService.sendSubscribeNotification({
  //       adminId,
  //       plantId,
  //     });

  //     res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.COMMON.SUCCESS.SEND_NOTIFICATION });
  //   } catch (error) {
  //     console.error("Error in sending notification:", error);
  //     next(error);
  //   }
  // }
  async plantBlockStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.params.plantId;
      const { isBlocked } = req.body;

      console.log({ plantId, isBlocked });

      if (typeof isBlocked !== "boolean") {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.INVALID_BLOCK,
        );
      }
      const wasteplant = await this._wastePlantService.plantBlockStatus(
        plantId,
        isBlocked,
      );
      res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: MESSAGES.COMMON.SUCCESS.BLOCK_UPDATE, wasteplant });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}
