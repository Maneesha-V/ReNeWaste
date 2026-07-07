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
exports.SuperAdminAuthService = void 0;
const inversify_1 = require("inversify");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authUtils_1 = require("../../utils/authUtils");
const otpUtils_1 = require("../../utils/otpUtils");
const mailerUtils_1 = require("../../utils/mailerUtils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = __importDefault(require("../../config/inversify/types"));
const SuperAdminMapper_1 = require("../../mappers/SuperAdminMapper");
let SuperAdminAuthService = class SuperAdminAuthService {
    superAdminRepository;
    userRepository;
    constructor(superAdminRepository, userRepository) {
        this.superAdminRepository = superAdminRepository;
        this.userRepository = userRepository;
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            const admin = await this.superAdminRepository.getSuperAdminById(decoded.userId);
            if (!admin) {
                throw new Error("Admin not found");
            }
            const accessToken = jsonwebtoken_1.default.sign(
            // { userId: admin._id, role: admin.role },
            { userId: decoded.userId, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "15min" });
            return { token: accessToken };
        }
        catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
    async adminLoginService({ email, password, }) {
        const admin = await this.superAdminRepository.findAdminByEmail(email);
        console.log("admin", admin);
        if (!admin) {
            throw new Error("Invalid email or password.");
        }
        const isPasswordValid = admin.password
            ? await bcrypt_1.default.compare(password, admin.password)
            : false;
        if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
        }
        const token = (0, authUtils_1.generateToken)({
            userId: admin._id.toString(),
            role: admin.role,
        });
        return { admin: SuperAdminMapper_1.SuperAdminMapper.mapSuperAdminDTO(admin), token };
    }
    async adminSignupService({ username, email, password, }) {
        const existingAdmin = await this.superAdminRepository.findAdminByEmail(email);
        if (existingAdmin) {
            throw new Error("Email already exists. Please use a different email.");
        }
        const existingUsername = await this.superAdminRepository.findAdminByUsername(username);
        if (existingUsername) {
            throw new Error("Username already exists.");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newAdmin = await this.superAdminRepository.createAdmin({
            username,
            email,
            password: hashedPassword,
            role: "superadmin",
        });
        // const token = generateToken({userId:newAdmin._id.toString(),role:newAdmin.role});
        // return { admin: SuperAdminMapper.mapSuperAdminDTO(newAdmin), token };
        if (!newAdmin) {
            throw new Error("Admin not created.");
        }
        return true;
    }
    async sendOtpService(email) {
        const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
        if (!superAdmin) {
            throw new Error("Superadmin  not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Generated OTP for ${email}:`, otp);
        await this.userRepository.saveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your OTP Code", `Your OTP code is: ${otp}. It will expire in 30s.`);
        return true;
    }
    async resendOtpService(email) {
        const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
        if (!superAdmin) {
            throw new Error("Superadmin not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Resend OTP for ${email}:`, otp);
        await this.userRepository.reSaveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your Resend OTP Code", `Your Resend OTP code is: ${otp}. It will expire in 30s.`);
        return true;
    }
    async verifyOtpService(email, otp) {
        const storedOtp = await this.userRepository.findOtpByEmail(email);
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
        await this.userRepository.deleteOtp(email);
        return true;
    }
    async resetPasswordService(email, newPassword) {
        const superAdmin = await this.superAdminRepository.findAdminByEmail(email);
        if (!superAdmin)
            throw new Error("Superadmin not found");
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        const updated = await this.superAdminRepository.updateAdminPassword(email, hashedPassword);
        return !!updated;
    }
};
exports.SuperAdminAuthService = SuperAdminAuthService;
exports.SuperAdminAuthService = SuperAdminAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.SuperAdminRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], SuperAdminAuthService);
