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
exports.AuthController = void 0;
const authUtils_1 = require("../../utils/authUtils");
const constantUtils_1 = require("../../utils/constantUtils");
const types_1 = __importDefault(require("../../config/inversify/types"));
const inversify_1 = require("inversify");
const ApiError_1 = require("../../utils/ApiError");
let AuthController = class AuthController {
    _authService;
    constructor(_authService) {
        this._authService = _authService;
    }
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            console.log("refreshToken", refreshToken);
            if (!refreshToken) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.REFRESH_TOKEN);
            }
            const { token } = await this._authService.verifyToken(refreshToken);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ token });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async superAdminLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const { admin, token } = await this._authService.adminLoginService({
                email,
                password,
            });
            if (!admin) {
                // res.status(401).json({ success: false, message: "Invalid credentials" });
                // return;
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.INVALID_CREDENTIALS);
            }
            console.log("admin", admin);
            const refreshToken = await (0, authUtils_1.generateRefreshToken)({
                userId: admin._id.toString(),
                role: admin.role,
            });
            const isProduction = process.env.NODE_ENV === "production";
            const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                path: "/api/super-admin",
                // sameSite: "strict" as "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            };
            res
                .cookie("refreshToken", refreshToken, cookieOptions)
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({
                success: true,
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.LOGIN,
                role: admin.role,
                adminId: admin._id,
                token,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async superAdminSignup(req, res, next) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.BAD_REQUEST, constantUtils_1.MESSAGES.COMMON.ERROR.MISSING_FIELDS);
            }
            const created = await this._authService.adminSignupService({
                username,
                email,
                password,
            });
            if (created) {
                res
                    .status(constantUtils_1.STATUS_CODES.CREATED)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.SIGNUP });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SERVER_ERROR)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.ERROR.SIGNUP });
            }
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async superAdminLogout(req, res, next) {
        try {
            const isProduction = process.env.NODE_ENV === "production";
            const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                // sameSite: "strict" as const,
                sameSite: isProduction ? "none" : "lax",
                path: "/api/super-admin",
            };
            res.clearCookie("refreshToken", cookieOptions);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.LOGOUT });
        }
        catch (error) {
            next(error);
        }
    }
    async sendOtp(req, res, next) {
        try {
            console.log("otp-body", req.body);
            const { email } = req.body;
            const otpResponse = await this._authService.sendOtpService(email);
            if (otpResponse) {
                res
                    .status(constantUtils_1.STATUS_CODES.CREATED)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.OTP_SENT });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SERVER_ERROR)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.ERROR.FAILED_OTP });
            }
        }
        catch (error) {
            console.error("Error sending OTP:", error);
            next(error);
        }
    }
    async resendOtp(req, res, next) {
        console.log("body", req.body);
        try {
            const { email } = req.body;
            if (!email) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.EMAIL_NOT_FOUND);
            }
            const success = await this._authService.resendOtpService(email);
            if (success) {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.OTP_SENT });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.SERVER_ERROR)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.ERROR.RESENT_OTP });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED);
            }
            const isValid = await this._authService.verifyOtpService(email, otp);
            if (isValid) {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.OTP_VERIFIED });
            }
            else {
                res
                    .status(constantUtils_1.STATUS_CODES.NOT_FOUND)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.ERROR.INVALID_EXPIRED_OTP });
            }
        }
        catch (error) {
            console.error("Error verifying OTP:", error);
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            console.log("body", req.body);
            const { email, password } = req.body;
            if (!email || !password) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.EMAIL_PASSWORD_REQUIRED);
            }
            await this._authService.resetPasswordService(email, password);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.PASSWORD_RESET });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.SuperAdminAuthService)),
    __metadata("design:paramtypes", [Object])
], AuthController);
