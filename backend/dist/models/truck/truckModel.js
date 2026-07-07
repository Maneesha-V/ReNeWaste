"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruckModel = void 0;
const mongoose_1 = require("mongoose");
const truckSchema_1 = require("./truckSchema");
exports.TruckModel = (0, mongoose_1.model)("Truck", truckSchema_1.truckSchema);
