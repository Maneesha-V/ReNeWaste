"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasteCollectionModel = void 0;
const mongoose_1 = require("mongoose");
const wasteCollectionSchema_1 = require("./wasteCollectionSchema");
exports.WasteCollectionModel = (0, mongoose_1.model)("WasteCollection", wasteCollectionSchema_1.wasteCollectionSchema);
