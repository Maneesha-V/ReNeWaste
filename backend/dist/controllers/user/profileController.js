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
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const user = await this.profileService.getUserProfile(userId);
            console.log("user", user);
            if (user) {
                res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ user });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.USER.ERROR.FETCH_PROFILE });
            }
        }
        catch (error) {
            // res.status(400).json({ error: error.message });
            next(error);
        }
    }
    async getEditProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const user = await this.profileService.getUserProfile(userId);
            if (user) {
                res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ user });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.USER.ERROR.FETCH_EDIT_PROFILE });
            }
        }
        catch (error) {
            // res.status(400).json({ error: error.message });
            next(error);
        }
    }
    async updateUserProfileHandler(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const updatedData = req.body;
            console.log("updatedData", updatedData);
            const updatedUser = await this.profileService.updateUserProfile(userId, updatedData);
            if (updatedUser) {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.USER.SUCCESS.PROFILE_UPDATE });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SERVER_ERROR)
                    .json({ message: constantUtils_1.MESSAGES.USER.ERROR.PROFILE_UPDATE });
            }
        }
        catch (error) {
            console.error("Error updating profile:", error);
            next(error);
        }
    }
};
exports.ProfileController = ProfileController;
exports.ProfileController = ProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserProfileService)),
    __metadata("design:paramtypes", [Object])
], ProfileController);
