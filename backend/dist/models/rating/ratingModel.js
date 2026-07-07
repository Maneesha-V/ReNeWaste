"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingModel = void 0;
const mongoose_1 = require("mongoose");
const ratingSchema_1 = require("./ratingSchema");
exports.RatingModel = (0, mongoose_1.model)("Rating", ratingSchema_1.RatingSchema);
