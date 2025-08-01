import { Request, Response } from "express";
import { IProfileController } from "./interface/IProfileController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IProfileService } from "../../services/wastePlant/interface/IProfileService";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";
import axios from "axios";
import { log } from "console";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { handleControllerError } from "../../utils/errorHandler";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.PlantProfileService)
    private profileService: IProfileService
  ) {}
  async getPlantProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;
      if (!plantId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const wasteplant = await this.profileService.getPlantProfile(plantId);
      res.status(200).json({ wasteplant });
    } catch (error: any) {
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  }
  async viewLicenseDocument(req: Request, res: Response): Promise<void> {
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
      handleControllerError(error, res, 500);
    }
  }
  async updatePlantProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("file", req.file);

      const plantId = req.user?.id;
      const updatedData = req.body;
      console.log({ plantId, updatedData });
      if (!plantId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
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
              }
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
        updatedData
      );
      console.log("updatedPlant", updatedPlant);

      res.status(200).json({ wasteplant: updatedPlant });
    } catch (error) {
      console.error("Error updating plant profile:", error);
      handleControllerError(error, res, 500);
    }
  }
  //   async getDriversByWastePlant (req: Request, res: Response): Promise<void> {
  //     try {
  //       const wastePlantId = req.query.wastePlantId as string;

  //       if (!wastePlantId) {
  //          res.status(400).json({ message: "wastePlantId is required" });
  //          return;
  //       }
  //       const drivers = await this.profileService.fetchDriversService(wastePlantId)

  //       res.status(200).json({data:drivers});
  //     } catch (error) {
  //       console.error("Error fetching drivers:", error);
  //       res.status(500).json({ message: "Server error while fetching drivers" });
  //     }
  //   };
}
