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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
const UserMapper_1 = require("../../mappers/UserMapper");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers(wasteplantId, page, limit, search) {
        const { users, total } = await this.userRepository.getUsersByWastePlantId(wasteplantId, page, limit, search);
        return {
            users: UserMapper_1.UserMapper.mapUsersDTO(users),
            total,
        };
    }
    async userBlockStatusService(wasteplantId, userId, isBlocked) {
        const user = await this.userRepository.findUserById(userId);
        if (!user ||
            !user.wasteplantId ||
            String(user.wasteplantId) !== String(wasteplantId)) {
            throw new Error("User not found");
        }
        user.isBlocked = isBlocked;
        await user.save({ validateModifiedOnly: true });
        return UserMapper_1.UserMapper.mapUserDTO(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __metadata("design:paramtypes", [Object])
], UserService);
