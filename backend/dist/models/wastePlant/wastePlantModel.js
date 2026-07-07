"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WastePlantModel = void 0;
const mongoose_1 = require("mongoose");
const wastePlantSchema_1 = require("../wastePlant/wastePlantSchema");
exports.WastePlantModel = (0, mongoose_1.model)("WastePlant", wastePlantSchema_1.wastePlantSchema);
