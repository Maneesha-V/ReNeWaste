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
exports.DropSpotRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dropSpotModel_1 = require("../../models/dropSpots/dropSpotModel");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const inversify_1 = require("inversify");
let DropSpotRepository = class DropSpotRepository extends baseRepository_1.default {
    constructor() {
        super(dropSpotModel_1.DropSpotModel);
    }
    async createDropSpot(payload) {
        const created = new this.model(payload);
        return await created.save();
    }
    async getDropSpotsByWastePlantId(wasteplantId, page, limit, search) {
        const query = {
            wasteplantId,
            $or: [
                { dropSpotName: { $regex: search, $options: "i" } },
                { addressLine: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { pincode: { $regex: search, $options: "i" } },
                { state: { $regex: search, $options: "i" } },
                { district: { $regex: search, $options: "i" } },
            ],
        };
        const skip = (page - 1) * limit;
        const dropspots = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.model.countDocuments(query);
        console.log("dropspots", dropspots);
        return { dropspots, total };
    }
    async getDropSpotsByLocationAndWasteplant({ location, district, state, wasteplantId, }) {
        console.log({ location, district, state, wasteplantId });
        return await this.model.find({
            location,
            district,
            state,
            wasteplantId,
        });
    }
    async findDropSpotById(dropSpotId, wasteplantId) {
        return await this.model.findOne({
            _id: new mongoose_1.default.Types.ObjectId(dropSpotId),
            wasteplantId,
        });
    }
    async deleteDropSpotById(dropSpotId, wasteplantId) {
        return await this.model.findOneAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(dropSpotId),
            wasteplantId,
        });
    }
    async updateDropSpot(dropSpotId, updateData) {
        return await this.model.findByIdAndUpdate(dropSpotId, updateData, {
            new: true,
        });
    }
};
exports.DropSpotRepository = DropSpotRepository;
exports.DropSpotRepository = DropSpotRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DropSpotRepository);
