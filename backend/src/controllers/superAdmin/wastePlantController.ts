import { Request, Response } from "express";
import { IWastePlant } from "../../models/wastePlant/interfaces/wastePlantInterface";
import { IWastePlantController } from "./interface/IWastePlantController";
import { AuthRequest } from "../../types/common/middTypes";
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
import { handleControllerError } from "../../utils/errorHandler";

@injectable()
export class WastePlantController implements IWastePlantController {
  constructor(
    @inject(TYPES.SuperAdminPlantService)
    private wastePlantService: IWastePlantService
  ) {}
  async addWastePlant(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ error: MESSAGES.WASTEPLANT.ERROR.DOCUMENT_REQUIRED });
        return;
      }
      if (req.file.mimetype !== "application/pdf") {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ error: MESSAGES.WASTEPLANT.ERROR.PDF_FILES_REQUIRED });
        return;
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
            }
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
          typeof s === "string" ? s.split(",").map((item) => item.trim()) : []
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

      const newWastePlant = await this.wastePlantService.addWastePlant(
        wastePlantData
      );
      console.log("✅ Inserted Waste Plant:", newWastePlant);
      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.CREATED,
      });
    } catch (error) {
      console.error("err", error);
      handleControllerError(error, res, 500);
      // res
      //   .status(500)
      //   .json({ error: error.message || "Failed to create waste plant" });
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
    } catch (error: any) {
      console.error("Error while fetching license document:", error);
      res.status(500).json({ error: "Failed to retrieve document" });
    }
  }
  async fetchPostOffices(req: Request, res: Response): Promise<void> {
    const { pincode } = req.params;
    try {
      const response = await axios.get<IndiaPostAPIResponse[]>(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      const result = response.data[0];

      if (result.Status !== "Success" || !result.PostOffice) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: "No post offices found for this PIN code." });
        return;
      }
      console.log("postOffices", result.PostOffice);
      const isMalappuram = result.PostOffice.some(
        (po: PostOfficeEntry) => po.District.toLowerCase() === "malappuram"
      );
      if (!isMalappuram) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          message: "Only pincodes from Malappuram district are allowed",
        });
        return;
      }
      const postOffices = result.PostOffice.map((po: PostOfficeEntry) => ({
        name: po.Name,
        taluk: po.Taluk || po.SubDivision || po.Block || po.Division || "",
      }));

      res.status(STATUS_CODES.SUCCESS).json(postOffices);
    } catch (error) {
      console.error("Error fetching post office data:", error);
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: "Failed to fetch location info" });
    }
  }
  async fetchWastePlants(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log(req.query);
      const DEFAULT_LIMIT = 5;
      const MAX_LIMIT = 50;
      const page = parseInt(req.query.page as string) || 1;
      let limit = Math.min(
        parseInt(req.query.limit as string) || DEFAULT_LIMIT,
        MAX_LIMIT
      );
      const search = (req.query.search as string) || "";
      const { total, wasteplants } =
        await this.wastePlantService.getAllWastePlants({ page, limit, search });
      // const total, wasteplants = await this.wastePlantService.getAllWastePlants();
      console.log({ total, wasteplants });

      res.status(200).json({
        success: true,
        message: "Fetch waste plants successfully",
        wasteplants,
        total,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching waste plants", error });
    }
  }
  async getWastePlantById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const wastePlant = await this.wastePlantService.getWastePlantByIdService(
        id
      );
      console.log("wastePlant", wastePlant);

      if (!wastePlant) {
        res.status(404).json({ message: "Waste Plant not found" });
        return;
      }

      res.status(200).json({ data: wastePlant });
    } catch (error: any) {
      console.error("Error fetching waste plant:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async updateWastePlant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Super Admin ID is required" });
        return;
      }
      const updatedData = req.body;
      if (req.file) {
        if (req.file.mimetype !== "application/pdf") {
          res
            .status(400)
            .json({ error: "Only PDF files are allowed for license upload." });
          return;
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
              }
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
          typeof s === "string" ? s.split(",").map((item) => item.trim()) : []
        );
      } else if (typeof rawServices === "string") {
        updatedData.services = rawServices
          .split(",")
          .map((item) => item.trim());
      }
      const updatedWastePlant =
        await this.wastePlantService.updateWastePlantByIdService(
          id,
          updatedData
        );
      console.log("wastePlant", updatedWastePlant);
      if (!updatedWastePlant) {
        res.status(404).json({ message: "Waste plant not found" });
        return;
      }
      res.status(200).json({
        message: "Waste Plant updated successfully",
        wastePlant: updatedWastePlant,
      });
    } catch (error: any) {
      console.error("Error updating waste plant:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async deleteWastePlantById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedPlant =
        await this.wastePlantService.deleteWastePlantByIdService(id);

      if (!updatedPlant) {
        res.status(404).json({ message: "Waste Plant not found" });
        return;
      }

      res.status(200).json({
        success: true,
        updatedPlant,
        message: "Waste Plant deleted successfully",
      });
    } catch (error: any) {
      console.error("Error in deleting waste plant:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async sendSubscribeNotification(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        res.status(404).json({ message: "Unauthorized Id is not found." });
        return;
      }
      const plantId = req.params.id;
      await this.wastePlantService.sendSubscribeNotification({
        adminId,
        plantId,
      });

      res.status(200).json({ message: "Send notification successfully" });
    } catch (error: any) {
      console.error("Error in sending notification:", error);
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
}
