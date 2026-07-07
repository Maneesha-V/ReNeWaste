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
const authUtils_1 = require("../../utils/authUtils");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const constantUtils_1 = require("../../utils/constantUtils");
const ApiError_1 = require("../../utils/ApiError");
let UserController = class UserController {
    _authService;
    constructor(_authService) {
        this._authService = _authService;
    }
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            console.log("refreshToken", refreshToken);
            if (!refreshToken) {
                // res.status(STATUS_CODES.UNAUTHORIZED).json({ error: MESSAGES.COMMON.ERROR.REFRESH_TOKEN });
                // return;
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.UNAUTHORIZED, constantUtils_1.MESSAGES.COMMON.ERROR.REFRESH_TOKEN);
            }
            const { token } = await this._authService.verifyToken(refreshToken);
            res.status(constantUtils_1.STATUS_CODES.SUCCESS).json({ token });
        }
        catch (error) {
            console.error("err", error);
            // res.status(401).json({ error: error.message });
            next(error);
        }
    }
    async signup(req, res, next) {
        console.log("body", req.body);
        try {
            const userData = req.body;
            console.log("userData", userData);
            if (userData.password !== userData.confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            const { confirmPassword, ...userWithoutConfirm } = userData;
            const { user, token } = await this._authService.signupUser(userWithoutConfirm);
            console.log("user", user);
            res.status(constantUtils_1.STATUS_CODES.CREATED).json({
                success: true,
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.SIGNUP,
                // role: user.role,
                // userId: user._id,
                // token,
            });
        }
        catch (error) {
            console.log("err", error);
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this._authService.loginUser({
                email,
                password,
            });
            const refreshToken = await (0, authUtils_1.generateRefreshToken)({
                userId: user._id,
                role: user.role,
            });
            const isProduction = process.env.NODE_ENV === "production";
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: isProduction ? "none" : "lax",
                path: "/api",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            };
            res
                .cookie("refreshToken", refreshToken, cookieOptions)
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({
                success: true,
                message: constantUtils_1.MESSAGES.COMMON.SUCCESS.LOGIN,
                role: user.role,
                userId: user._id,
                token,
            });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const isProduction = process.env.NODE_ENV === "production";
            const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                path: "/api",
            };
            res.clearCookie("refreshToken", cookieOptions);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.LOGOUT });
        }
        catch (error) {
            console.error("err", error);
            next(error);
        }
    }
    async sendOtpForSignup(req, res, next) {
        try {
            console.log("otp-body", req.body);
            const { email } = req.body;
            const otpResponse = await this._authService.sendOtpSignupService(email);
            if (!otpResponse) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.OTP_SENT);
            }
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.OTP_SENT });
        }
        catch (error) {
            console.error("Error sending OTP:", error);
            // res.status(500).json({ error: error.message || "Internal Server Error" });
            next(error);
        }
    }
    async resendOtpForSignup(req, res, next) {
        console.log("body", req.body);
        try {
            const { email } = req.body;
            if (!email) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.EMAIL_NOT_FOUND);
            }
            const success = await this._authService.resendOtpSignupService(email);
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
            // res.status(500).json({ error: "Server error, please try again later" });
            next(error);
        }
    }
    async verifyOtpForSignup(req, res, next) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                // res
                //   .status(STATUS_CODES.NOT_FOUND)
                //   .json({ error: MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED });
                // return;
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED);
            }
            const isValid = await this._authService.verifyOtpSignupService(email, otp);
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
    async sendOtp(req, res, next) {
        try {
            console.log("otp-body", req.body);
            const { email } = req.body;
            await this._authService.sendOtpService(email);
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.OTP_SENT });
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
            console.log("success", success);
            if (success) {
                res
                    .status(constantUtils_1.STATUS_CODES.SUCCESS)
                    .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.OTP_SENT });
            }
            else {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.SERVER_ERROR, constantUtils_1.MESSAGES.COMMON.ERROR.FAILED_OTP);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;
            console.log(req.body);
            if (!email || !otp) {
                res
                    .status(constantUtils_1.STATUS_CODES.NOT_FOUND)
                    .json({ error: constantUtils_1.MESSAGES.COMMON.ERROR.EMAIL_OTP_REQUIRED });
                return;
            }
            const isValid = await this._authService.verifyOtpService(email, otp);
            if (!isValid) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.INVALID_EXPIRED_OTP);
            }
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.OTP_VERIFIED });
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
            // res.status(500).json({ message: "Server error" });
        }
    }
    async googleSignUp(req, res, next) {
        try {
            console.log("body", req.body);
            const { email, displayName, uid } = req.body;
            if (!email || !uid) {
                throw new ApiError_1.ApiError(constantUtils_1.STATUS_CODES.NOT_FOUND, constantUtils_1.MESSAGES.COMMON.ERROR.EMAIL_UID_REQUIRED);
                // res.status(400).json({ message: "Email and UID are required" });
                // return;
            }
            const { role, token } = await this._authService.googleSignUpService({
                email,
                displayName,
                uid,
            });
            res
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({ message: constantUtils_1.MESSAGES.COMMON.SUCCESS.SIGNUP, role, token });
        }
        catch (error) {
            console.error("Google Sign-Up Error:", error);
            next(error);
        }
    }
    async googleLogin(req, res, next) {
        try {
            console.log("body", req.body);
            const { email, googleId } = req.body;
            const response = await this._authService.googleLoginService({
                email,
                googleId,
            });
            const { role, token, userId } = response;
            const refreshToken = await (0, authUtils_1.generateRefreshToken)({
                userId: userId,
                role: role,
            });
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            };
            res
                .cookie("refreshToken", refreshToken, cookieOptions)
                .status(constantUtils_1.STATUS_CODES.SUCCESS)
                .json({
                success: true,
                message: "Google signin successful",
                role,
                token,
            });
        }
        catch (error) {
            console.error("Google login error:", error);
            next(error);
            // res.status(500).json({
            //   message: error.message || "Something went wrong during login",
            // });
        }
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserAuthService)),
    __metadata("design:paramtypes", [Object])
], UserController);
