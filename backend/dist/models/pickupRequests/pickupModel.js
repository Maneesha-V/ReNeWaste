"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupModel = void 0;
const mongoose_1 = require("mongoose");
const pickupSchema_1 = require("./pickupSchema");
exports.PickupModel = (0, mongoose_1.model)("PickupRequests", pickupSchema_1.pickupRequestSchema);
