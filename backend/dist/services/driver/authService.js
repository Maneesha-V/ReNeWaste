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
const DriverMapper_1 = require("../../mappers/DriverMapper");
let AuthService = class AuthService {
    userRepository;
    driverRepository;
    constructor(userRepository, getDriverRepo) {
        this.userRepository = userRepository;
        this.driverRepository = getDriverRepo();
    }
    async verifyToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const driver = await this.driverRepository.getDriverById(decoded.userId);
        if (!driver) {
            throw new Error("Driver not found");
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: driver._id, role: driver.role }, process.env.JWT_SECRET, { expiresIn: "15min" });
        return { token: accessToken };
    }
    async loginDriver({ email, password }) {
        const driver = await this.driverRepository.findDriverByEmail(email);
        if (!driver || !(await bcrypt_1.default.compare(password, driver.password || ""))) {
            throw new Error("Invalid email or password.");
        }
        const token = (0, authUtils_1.generateToken)({
            userId: driver._id.toString(),
            role: driver.role,
        });
        return {
            driver: DriverMapper_1.DriverMapper.mapDriverDTO(driver),
            token,
        };
    }
    async sendOtpService(email) {
        const driver = await this.driverRepository.findDriverByEmail(email);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Generated OTP for ${email}:`, otp);
        await this.userRepository.saveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your OTP Code", `Your OTP code is: ${otp}. It will expire in 30s.`);
        return otp;
    }
    async resendOtpService(email) {
        const driver = await this.driverRepository.findDriverByEmail(email);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Resend OTP for ${email}:`, otp);
        await this.userRepository.reSaveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your Resend OTP Code", `Your Resend OTP code is: ${otp}. It will expire in 30s.`);
        return otp;
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
        const driver = await this.driverRepository.findDriverByEmail(email);
        if (!driver)
            throw new Error("Driver not found");
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await this.driverRepository.updateDriverPassword(email, hashedPassword);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.DriverRepositoryFactory)),
    __metadata("design:paramtypes", [Object, Function])
], AuthService);
