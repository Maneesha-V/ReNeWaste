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
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const authUtils_1 = require("../../utils/authUtils");
const mailerUtils_1 = require("../../utils/mailerUtils");
const otpUtils_1 = require("../../utils/otpUtils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = __importDefault(require("../../config/inversify/types"));
const WastePlantMapper_1 = require("../../mappers/WastePlantMapper");
let AuthService = class AuthService {
    wastePlantRepository;
    constructor(wastePlantRepository) {
        this.wastePlantRepository = wastePlantRepository;
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            console.log("Refresh token payload:", decoded);
            const wastePlant = await this.wastePlantRepository.getWastePlantById(decoded.userId);
            console.log("wastePlant", wastePlant);
            if (!wastePlant) {
                throw new Error("Wasteplant not found");
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: wastePlant._id, role: wastePlant.role }, process.env.JWT_SECRET, { expiresIn: "15min" });
            return { token: accessToken };
        }
        catch (error) {
            console.error("Refresh token error", error);
            throw new Error("Invalid or expired refresh token");
        }
    }
    async loginWastePlant({ email, password }) {
        const wastePlant = await this.wastePlantRepository.findWastePlantByEmail(email);
        if (!wastePlant ||
            !(await bcrypt_1.default.compare(password, wastePlant.password || ""))) {
            throw new Error("Invalid email or password.");
        }
        if (wastePlant?.isBlocked) {
            throw new Error("Your account has been blocked by the superadmin.");
        }
        const token = (0, authUtils_1.generateToken)({
            userId: wastePlant._id.toString(),
            role: wastePlant.role,
        });
        return { wastePlant: WastePlantMapper_1.WastePlantMapper.mapWastePlantDTO(wastePlant), token };
    }
    async sendOtpService(email) {
        const wastePlant = await this.wastePlantRepository.findWastePlantByEmail(email);
        if (!wastePlant) {
            throw new Error("Wasteplant not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Generated OTP for ${email}:`, otp);
        await this.wastePlantRepository.saveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your OTP Code", `Your OTP code is: ${otp}. It will expire in 30s.`);
        return otp;
    }
    async resendOtpService(email) {
        const wastePlant = await this.wastePlantRepository.findWastePlantByEmail(email);
        if (!wastePlant) {
            throw new Error("User not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Resend OTP for ${email}:`, otp);
        await this.wastePlantRepository.reSaveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your Resend OTP Code", `Your Resend OTP code is: ${otp}. It will expire in 30s.`);
        return otp;
    }
    async verifyOtpService(email, otp) {
        const storedOtp = await this.wastePlantRepository.findOtpByEmail(email);
        if (!storedOtp || storedOtp.otp !== otp)
            return false;
        const createdAt = storedOtp.createdAt;
        if (!createdAt) {
            throw new Error("OTP creation date is missing.");
        }
        const otpAge = (new Date().getTime() - new Date(createdAt).getTime()) / 1000;
        if (otpAge > 30) {
            return false;
        }
        await this.wastePlantRepository.deleteOtp(email);
        return true;
    }
    async resetPasswordService(email, newPassword) {
        const wastePlant = await this.wastePlantRepository.findWastePlantByEmail(email);
        if (!wastePlant)
            throw new Error("User not found");
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await this.wastePlantRepository.updateWastePlantPassword(email, hashedPassword);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __metadata("design:paramtypes", [Object])
], AuthService);
