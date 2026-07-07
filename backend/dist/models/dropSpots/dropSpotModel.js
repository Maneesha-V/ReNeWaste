"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropSpotModel = void 0;
const mongoose_1 = require("mongoose");
const dropSpotSchema_1 = require("./dropSpotSchema");
exports.DropSpotModel = (0, mongoose_1.model)("DropSpot", dropSpotSchema_1.DropSpotSchema);
