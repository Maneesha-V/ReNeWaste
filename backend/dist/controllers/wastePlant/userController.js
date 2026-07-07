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
exports.UserController = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const ApiError_1 = require("../../utils/ApiError");
const constantUtils_1 = require("../../utils/constantUtils");
let UserController = class UserController {
    _userService;
    constructor(_userService) {
        this._userService = _userService;
    }
    async fetchUsers(req, res, next) {
        try {
            const wasteplantId = req.user?.id;
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const search = req.query.search || "";
            const { users, total } = await this._userService.getAllUsers(wasteplantId, page, limit, search);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({
                success: true,
                message: constantUtils_1.MESSAGES.WASTEPLANT.SUCCESS.FETCH_USER,
                users,
                total,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async userBlockStatus(req, res, next) {
        try {
            const userId = req.params.userId;
            const { isBlocked } = req.body;
            const wasteplantId = req.user?.id;
            console.log({ userId, isBlocked, wasteplantId });
            if (!wasteplantId) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED);
            }
            if (typeof isBlocked !== "boolean") {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.INVALID_BLOCK);
            }
            const updatedUser = await this._userService.userBlockStatusService(wasteplantId, userId, isBlocked);
            console.log("updatedUser ", updatedUser);
            res.json({
                success: true,
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.BLOCK_UPDATE,
                updatedUser,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PlantUserService)),
    __metadata("design:paramtypes", [Object])
], UserController);
