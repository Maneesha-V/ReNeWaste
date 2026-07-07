"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateWastePlant = exports.authenticateDriver = exports.authenticateSuperAdmin = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const superAdminModel_1 = require("../models/superAdmin/superAdminModel");
const driverModel_1 = require("../models/driver/driverModel");
const wastePlantModel_1 = require("../models/wastePlant/wastePlantModel");
const ApiError_1 = require("../utils/ApiError");
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log("Received Token:", token);
        if (!token)
            return res.status(401).json({ error: "No token, authorization denied" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    }
    catch (err) {
        next(new ApiError_1.ApiError(401, "Invalid token"));
    }
};
exports.authenticateUser = authenticateUser;
const authenticateSuperAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log("Received Token:", token);
        if (!token)
            return res.status(401).json({ error: "No token, authorization denied" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token in middleware:", decoded);
        const superadmin = await superAdminModel_1.SuperAdminModel.findById(new mongoose_1.default.Types.ObjectId(decoded.userId)).select("-password");
        console.log("superadmin Found:", superadmin);
        if (!superadmin) {
            return res.status(404).json({ error: "SuperAdmin not found" });
        }
        req.user = { id: superadmin._id.toString(), role: superadmin.role };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.authenticateSuperAdmin = authenticateSuperAdmin;
const authenticateDriver = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token)
            return res.status(401).json({ error: "No token, authorization denied" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const driver = await driverModel_1.DriverModel.findById(new mongoose_1.default.Types.ObjectId(decoded.userId)).select("-password");
        console.log("driver Found:", driver);
        if (!driver) {
            return res.status(404).json({ error: "Driver not found" });
        }
        req.user = { id: driver._id.toString(), role: driver.role };
        next();
    }
    catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.authenticateDriver = authenticateDriver;
const authenticateWastePlant = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token)
            return res.status(401).json({ error: "No token, authorization denied" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const wastePlant = await wastePlantModel_1.WastePlantModel.findById(new mongoose_1.default.Types.ObjectId(decoded.userId)).select("-password");
        // console.log("plant Found:", wastePlant);
        if (!wastePlant) {
            return res.status(404).json({ error: "wastePlant not found" });
        }
        req.user = { id: wastePlant._id.toString(), role: wastePlant.role };
        next();
    }
    catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.authenticateWastePlant = authenticateWastePlant;
