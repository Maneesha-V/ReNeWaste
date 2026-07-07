"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const axios_1 = __importDefault(require("axios"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getPlantProfile(req, res, next) {
        try {
            const plantId = req.user?.id;
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const wasteplant = await this.profileService.getPlantProfile(plantId);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ wasteplant });
        }
        catch (error) {
            console.log("error", error);
            next(error);
        }
    }
    async viewLicenseDocument(req, res, next) {
        try {
            const publicId = req.params.publicId;
            const fileUrl = cloudinary_1.default.url(publicId, {
                resource_type: "raw",
                secure: true,
            });
            const response = await axios_1.default.get(fileUrl, { responseType: "stream" });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline");
            response.data.pipe(res);
        }
        catch (error) {
            next(error);
        }
    }
    async updatePlantProfile(req, res, next) {
        try {
            console.log("file", req.file);
            const plantId = req.user?.id;
            const updatedData = req.body;
            console.log({ plantId, updatedData });
            if (!plantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            if (req.file) {
                const uploadFromBuffer = () => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary_1.default.uploader.upload_stream({
                            folder: "waste-plants/licenses",
                            resource_type: "raw",
                            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                        }, (error, result) => {
                            if (error)
                                return reject(error);
                            resolve(result);
                        });
                        streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                    });
                };
                const uploadResult = await uploadFromBuffer();
                // updatedData.licenseDocumentPath = uploadResult.secure_url;
                updatedData.cloudinaryPublicId = uploadResult.public_id;
            }
            const updatedPlant = await this.profileService.updatePlantProfile(plantId, updatedData);
            console.log("updatedPlant", updatedPlant);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ updatedPlant });
        }
        catch (error) {
            console.error("Error updating plant profile:", error);
            next(error);
        }
    }
};
exports.ProfileController = ProfileController;
exports.ProfileController = ProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantProfileService)),
    __metadata("design:paramtypes", [Object])
], ProfileController);
