"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverModel = void 0;
const mongoose_1 = require("mongoose");
const driverSchema_1 = require("./driverSchema");
exports.DriverModel = (0, mongoose_1.model)("Driver", driverSchema_1.driverSchema);
