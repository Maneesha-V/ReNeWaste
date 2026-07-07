"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.driverSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    experience: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active",
    },
    licenseFront: { type: String, required: true },
    licenseBack: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["driver", "user", "superadmin", "wasteplant"],
        default: "driver",
        required: true,
    },
    wasteplantId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "WastePlant",
        default: null,
    },
    assignedTruckId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Truck",
        default: null,
    },
    assignedZone: { type: String },
    hasRequestedTruck: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        enum: ["Residential", "Commercial", "Pending"],
        default: "Pending",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
