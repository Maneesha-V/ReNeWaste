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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const inversify_1 = require("inversify");
const otpModel_1 = require("../../models/user/otpModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
let OtpRepository = class OtpRepository extends baseRepository_1.default {
    constructor() {
        super(otpModel_1.OTPModel);
    }
    async saveOtp(email, otp) {
        await this.model.create({ email, otp, createdAt: new Date() });
    }
    async reSaveOtp(email, otp) {
        await this.model.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { new: true, upsert: true });
    }
    async findOtpByEmail(email) {
        return await this.model.findOne({ email });
    }
    async deleteOtp(email) {
        await this.model.deleteOne({ email });
    }
};
exports.OtpRepository = OtpRepository;
exports.OtpRepository = OtpRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OtpRepository);
