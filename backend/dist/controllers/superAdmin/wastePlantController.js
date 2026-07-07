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
exports.WastePlantController = void 0;
const types_1 = __importDefault(require("../../config/inversify/types"));
const inversify_1 = require("inversify");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const axios_1 = __importDefault(require("axios"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let WastePlantController = class WastePlantController {
    _wastePlantService;
    subscriptionService;
    constructor(_wastePlantService, subscriptionService) {
        this._wastePlantService = _wastePlantService;
        this.subscriptionService = subscriptionService;
    }
    async getAddWastePlant(req, res, next) {
        try {
            const subscriptionPlans = await this.subscriptionService.fetchActiveSubscriptionPlans();
            // console.log("subscriptionPlans", subscriptionPlans);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.SUPERADMIN.SUCCESS.ADD_WASTEPLANT,
                subscriptionPlans,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async addWastePlant(req, res, next) {
        try {
            console.log("file", req.file);
            if (!req.file) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.WASTEPLANT.ERROR.DOCUMENT_REQUIRED);
            }
            if (req.file.mimetype !== "application/pdf") {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.WASTEPLANT.ERROR.PDF_FILES_REQUIRED);
            }
            const uploadFromBuffer = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary_1.default.uploader.upload_stream({
                        folder: "waste-plants/licenses",
                        resource_type: "raw",
                        type: "private",
                    }, (error, result) => {
                        if (result) {
                            resolve(result);
                        }
                        else {
                            reject(error);
                        }
                    });
                    streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            const uploadResult = await uploadFromBuffer();
            const publicId = uploadResult.public_id;
            let services = [];
            const rawServices = req.body.services;
            if (Array.isArray(rawServices)) {
                services = rawServices.flatMap((s) => typeof s === "string" ? s.split(",").map((item) => item.trim()) : []);
            }
            else if (typeof rawServices === "string") {
                services = rawServices.split(",").map((item) => item.trim());
            }
            const wastePlantData = {
                ...req.body,
                district: "Malappuram",
                taluk: req.body.taluk,
                pincode: req.body.pincode,
                capacity: Number(req.body.capacity),
                services,
                cloudinaryPublicId: publicId,
            };
            const newWastePlant = await this._wastePlantService.addWastePlant(wastePlantData);
            console.log("✅ Inserted Waste Plant:", newWastePlant);
            res.status(constantUtils_1.STATUS_CODES.CREATED).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.CREATED,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async viewLicenseDocument(req, res, next) {
        try {
            console.log(req.user);
            const role = req.user?.role;
            const publicId = req.params.publicId;
            console.log({ role, publicId });
            if (!role || !publicId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const signedUrl = await this._wastePlantService.getLicenseUrl(publicId, role);
            const response = await axios_1.default.get(signedUrl, {
                responseType: "stream",
            });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline");
            response.data.pipe(res);
        }
        catch (error) {
            console.error("Error while fetching license document:", error);
            next(error);
        }
    }
    async fetchPostOffices(req, res, next) {
        const { pincode } = req.params;
        console.log("pincode", pincode);
        try {
            const response = await axios_1.default.get(`https://api.postalpincode.in/pincode/${pincode}`, {
                maxRedirects: 5,
            });
            const result = response.data[0];
            console.log("API raw result:", result);
            if (result.Status !== "Success" || !result.PostOffice) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.POST_OFFICE_ERROR);
            }
            console.log("postOffices", result.PostOffice);
            const isMalappuram = result.PostOffice.some((po) => po.District.toLowerCase() === "malappuram");
            if (!isMalappuram) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.FORBIDDEN, constantUtils_1.MESSAGES.COMMON.ERROR.PINCODE_ALLOW_ERROR);
            }
            const postOffices = result.PostOffice.map((po) => ({
                name: po.Name,
                taluk: po.Taluk || po.SubDivision || po.Block || po.Division || "",
            }));
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json(postOffices);
        }
        catch (error) {
            console.error("Error fetching post office data:", error);
            next(error);
        }
    }
    async fetchWastePlants(req, res, next) {
        try {
            console.log(req.query);
            const DEFAULT_LIMIT = 5;
            const MAX_LIMIT = 50;
            const page = parseInt(req.query.page) || 1;
            let limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
            const search = req.query.search || "";
            const capacityRangeStr = req.query.capacityRange;
            let minCapacity = 0;
            let maxCapacity = Infinity;
            if (capacityRangeStr) {
                const [minStr, maxStr] = capacityRangeStr.split("-");
                minCapacity = parseInt(minStr);
                maxCapacity = parseInt(maxStr);
            }
            const { total, wasteplants } = await this._wastePlantService.getAllWastePlants({
                page,
                limit,
                search,
                minCapacity,
                maxCapacity,
            });
            console.log({ total, wasteplants });
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.FETCH,
                wasteplants,
                total,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async getWastePlantById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const wastePlant = await this._wastePlantService.getWastePlantByIdService(id);
            console.log("wastePlant", wastePlant);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                wastePlant,
            });
        }
        catch (error) {
            console.error("Error fetching waste plant:", error);
            next(error);
        }
    }
    async updateWastePlant(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updatedData = req.body;
            if (req.file) {
                if (req.file.mimetype !== "application/pdf") {
                    throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.WASTEPLANT.ERROR.PDF_FILES_REQUIRED);
                }
                const uploadFromBuffer = () => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary_1.default.uploader.upload_stream({
                            folder: "waste-plants/licenses",
                            resource_type: "raw",
                            type: "private",
                        }, (error, result) => {
                            if (result) {
                                resolve(result);
                            }
                            else {
                                reject(error);
                            }
                        });
                        streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                    });
                };
                const uploadResult = await uploadFromBuffer();
                updatedData.cloudinaryPublicId = uploadResult.public_id;
            }
            if (updatedData.capacity) {
                updatedData.capacity = Number(updatedData.capacity);
            }
            const rawServices = req.body.services;
            if (Array.isArray(rawServices)) {
                updatedData.services = rawServices.flatMap((s) => typeof s === "string" ? s.split(",").map((item) => item.trim()) : []);
            }
            else if (typeof rawServices === "string") {
                updatedData.services = rawServices
                    .split(",")
                    .map((item) => item.trim());
            }
            const updatedWastePlant = await this._wastePlantService.updateWastePlantByIdService(id, updatedData);
            console.log("wastePlant", updatedWastePlant);
            if (!updatedWastePlant) {
                res.status(constantUtils_1.STATUS_CODES.SERVER_ERROR).json({
                    message: constantUtils_1.MESSAGES.WASTEPLANT.ERROR.FAILED,
                });
            }
            else {
                res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                    message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.UPDATED,
                });
            }
        }
        catch (error) {
            console.error("Error updating waste plant:", error);
            next(error);
        }
    }
    async deleteWastePlantById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.ID_REQUIRED);
            }
            const updatedPlant = await this._wastePlantService.deleteWastePlantByIdService(id);
            if (!updatedPlant) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.WASTEPLANT.ERROR.NOT_FOUND);
            }
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                updatedPlant,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.DELETED,
            });
        }
        catch (error) {
            console.error("Error in deleting waste plant:", error);
            next(error);
        }
    }
    async plantBlockStatus(req, res, next) {
        try {
            const plantId = req.params.plantId;
            const { isBlocked } = req.body;
            console.log({ plantId, isBlocked });
            if (typeof isBlocked !== "boolean") {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.INVALID_BLOCK);
            }
            const wasteplant = await this._wastePlantService.plantBlockStatus(plantId, isBlocked);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.BLOCK_UPDATE, wasteplant });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
};
exports.WastePlantController = WastePlantController;
exports.WastePlantController = WastePlantController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.SuperAdminPlantService)),
    __param(1, (0, inversify_1.inject)(types_1.default.SuperAdminSubscriptionService)),
    __metadata("design:paramtypes", [Object, Object])
], WastePlantController);
