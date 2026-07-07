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
exports.SuperAdminRepository = void 0;
const inversify_1 = require("inversify");
const superAdminModel_1 = require("../../models/superAdmin/superAdminModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
let SuperAdminRepository = class SuperAdminRepository extends baseRepository_1.default {
    constructor() {
        super(superAdminModel_1.SuperAdminModel);
    }
    async getSuperAdminById(adminId) {
        return this.model.findById(adminId).exec();
    }
    async findAdminByEmail(email) {
        return this.model.findOne({ email }).exec();
    }
    async findAdminByUsername(username) {
        return this.model.findOne({ username }).exec();
    }
    async createAdmin(adminData) {
        const admin = new this.model(adminData);
        return admin.save();
    }
    async updateAdminPassword(email, hashedPassword) {
        await this.model.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true, runValidators: false });
        return true;
    }
    async findAdminByRole(role) {
        return await this.model.findOne({ role });
    }
};
exports.SuperAdminRepository = SuperAdminRepository;
exports.SuperAdminRepository = SuperAdminRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SuperAdminRepository);
