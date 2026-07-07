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
exports.RatingService = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../config/inversify/types"));
let RatingService = class RatingService {
    _userRepository;
    _wastePlantRepository;
    _ratingRepository;
    constructor(_userRepository, _wastePlantRepository, _ratingRepository) {
        this._userRepository = _userRepository;
        this._wastePlantRepository = _wastePlantRepository;
        this._ratingRepository = _ratingRepository;
    }
    async addUserRating(payload) {
        const { userId } = payload;
        const user = await this._userRepository.findUserById(userId);
        if (!user || !user.wasteplantId)
            throw new Error("User not found.");
        const created = await this._ratingRepository.createRating(payload, user.wasteplantId.toString());
        if (!created) {
            throw new Error("Can't write user rating.");
        }
        return true;
    }
};
exports.RatingService = RatingService;
exports.RatingService = RatingService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.WastePlantRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.RatingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RatingService);
