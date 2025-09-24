import { NextFunction, Request, Response } from "express";
import { IProfileController } from "./interface/IProfileController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IProfileService } from "../../services/wastePlant/interface/IProfileService";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";
import axios from "axios";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.PlantProfileService)
    private profileService: IProfileService,
  ) {}
  async getPlantProfile(
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
      const wasteplant = await this.profileService.getPlantProfile(plantId);
      res.status(STATUS_CODES.SUCCESS).json({ wasteplant });
    } catch (error) {
      console.log("error", error);
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
      next(error);
    }
  }
  async updatePlantProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("file", req.file);

      const plantId = req.user?.id;
      const updatedData = req.body;
      console.log({ plantId, updatedData });
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      if (req.file) {
        const uploadFromBuffer = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "waste-plants/licenses",
                resource_type: "raw",
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              },
            );
            streamifier.createReadStream(req.file!.buffer).pipe(stream);
          });
        };

        const uploadResult = await uploadFromBuffer();

        updatedData.licenseDocumentPath = uploadResult.secure_url;
        updatedData.cloudinaryPublicId = uploadResult.public_id;
      }

      const updatedPlant = await this.profileService.updatePlantProfile(
        plantId,
        updatedData,
      );
      console.log("updatedPlant", updatedPlant);

      res.status(STATUS_CODES.SUCCESS).json({ updatedPlant });
    } catch (error) {
      console.error("Error updating plant profile:", error);
      next(error);
    }
  }
}
