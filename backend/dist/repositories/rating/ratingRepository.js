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
exports.RatingRepository = void 0;
const inversify_1 = require("inversify");
const baseRepository_1 = __importDefault(require("../baseRepository/baseRepository"));
const ratingModel_1 = require("../../models/rating/ratingModel");
const mongoose_1 = __importDefault(require("mongoose"));
let RatingRepository = class RatingRepository extends baseRepository_1.default {
    constructor() {
        super(ratingModel_1.RatingModel);
    }
    async createRating(payload, wasteplantId) {
        const { userId, data: { rating, comment }, } = payload;
        await this.model.create({
            userId,
            wasteplantId,
            rating,
            comment,
        });
        return true;
    }
    async getWPRatingSummary(plantId) {
        const result = await this.model.aggregate([
            {
                $match: {
                    wasteplantId: new mongoose_1.default.Types.ObjectId(plantId),
                },
            },
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: null,
                                averageRating: { $avg: "$rating" },
                                totalReviews: { $sum: 1 },
                            },
                        },
                    ],
                    latestReview: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $project: {
                                _id: 0,
                                rating: 1,
                                comment: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                },
            },
        ]);
        const summary = result[0].summary[0];
        const latestReview = result[0].latestReview[0];
        return {
            averageRating: summary ? Number(summary.averageRating.toFixed(1)) : 0,
            totalReviews: summary ? summary.totalReviews : 0,
            latestReview: latestReview ?? null,
        };
    }
};
exports.RatingRepository = RatingRepository;
exports.RatingRepository = RatingRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RatingRepository);
