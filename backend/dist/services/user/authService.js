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
const bcrypt_1 = __importDefault(require("bcrypt"));
const authUtils_1 = require("../../utils/authUtils");
const otpUtils_1 = require("../../utils/otpUtils");
const mailerUtils_1 = require("../../utils/mailerUtils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const UserMapper_1 = require("../../mappers/UserMapper");
let AuthService = class AuthService {
    _userRepository;
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            const user = await this._userRepository.findUserById(decoded.userId);
            if (!user) {
                throw new Error("USer not found");
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15min" });
            return { token: accessToken };
        }
        catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
    async signupUser(userData) {
        const existingUser = await this._userRepository.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error("Email already exists. Please use a different email.");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = userData.password
            ? await bcrypt_1.default.hash(userData.password, salt)
            : undefined;
        const newUserData = {
            ...userData,
            password: hashedPassword,
            addresses: userData.addresses || [],
        };
        if (userData.googleId) {
            newUserData.googleId = userData.googleId;
        }
        const newUser = await this._userRepository.createUser(newUserData);
        const token = (0, authUtils_1.generateToken)({
            userId: newUser._id.toString(),
            role: newUser.role,
        });
        // return { user: newUser, token };
        return { user: UserMapper_1.UserMapper.mapUserLoginDTO(newUser), token };
    }
    async loginUser({ email, password }) {
        const user = await this._userRepository.findUserByEmail(email);
        if (!user || !(await bcrypt_1.default.compare(password, user.password || ""))) {
            throw new Error("Invalid email or password.");
        }
        if (user.isBlocked) {
            throw new Error("Your account has been blocked by the waste plant.");
        }
        const token = (0, authUtils_1.generateToken)({
            userId: user._id.toString(),
            role: user.role,
        });
        return { user: UserMapper_1.UserMapper.mapUserLoginDTO(user), token };
    }
    async sendOtpSignupService(email) {
        const existingUser = await this._userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("User already exists.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Generated OTP for ${email}:`, otp);
        await this._userRepository.saveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your OTP Code", `Your OTP code is: ${otp}. It will expire in 30s.`);
        return true;
    }
    async resendOtpSignupService(email) {
        const existingUser = await this._userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("User already exists.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Resend OTP for ${email}:`, otp);
        await this._userRepository.reSaveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your Resend OTP Code", `Your Resend OTP code is: ${otp}. It will expire in 30s.`);
        return true;
    }
    async verifyOtpSignupService(email, otp) {
        const storedOtp = await this._userRepository.findOtpByEmail(email);
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
        await this._userRepository.deleteOtp(email);
        return true;
    }
    async sendOtpService(email) {
        const user = await this._userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error("User not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Generated OTP for ${email}:`, otp);
        await this._userRepository.saveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your OTP Code", `Your OTP code is: ${otp}. It will expire in 30s.`);
    }
    async resendOtpService(email) {
        const user = await this._userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error("User not found.");
        }
        const otp = (0, otpUtils_1.generateOtp)();
        console.log(`Resend OTP for ${email}:`, otp);
        await this._userRepository.reSaveOtp(email, otp);
        await (0, mailerUtils_1.sendEmail)(email, "Your Resend OTP Code", `Your Resend OTP code is: ${otp}. It will expire in 30s.`);
        return true;
    }
    async verifyOtpService(email, otp) {
        const storedOtp = await this._userRepository.findOtpByEmail(email);
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
        await this._userRepository.deleteOtp(email);
        return true;
    }
    async resetPasswordService(email, newPassword) {
        const user = await this._userRepository.findUserByEmail(email);
        if (!user)
            throw new Error("User not found");
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await this._userRepository.updateUserPassword(email, hashedPassword);
    }
    async googleSignUpService({ email, displayName, uid, }) {
        let user = await this._userRepository.findUserByEmail(email);
        if (!user) {
            user = await this._userRepository.createUser({
                firstName: displayName.split(" ")[0] || "",
                lastName: displayName.split(" ")[1] || "",
                email,
                password: undefined,
                agreeToTerms: true,
                role: "user",
                phone: undefined,
                googleId: uid,
                addresses: [],
                isBlocked: false,
            });
        }
        const token = (0, authUtils_1.generateToken)({
            userId: user._id.toString(),
            role: user.role,
        });
        return { role: user.role, token };
    }
    async googleLoginService({ email, googleId, }) {
        const user = await this._userRepository.findUserByEmailGoogleId(email, googleId);
        if (!user) {
            throw new Error("User could not be created or found");
        }
        if (user.isBlocked) {
            throw new Error("Your account has been blocked.");
        }
        const token = (0, authUtils_1.generateToken)({
            userId: user._id.toString(),
            role: user.role,
        });
        return { role: user.role, token, userId: user._id.toString() };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __metadata("design:paramtypes", [Object])
], AuthService);
