"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminModel = void 0;
const mongoose_1 = require("mongoose");
const superAdminSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "driver", "superadmin", "wasteplant"],
        default: "superadmin",
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});
exports.SuperAdminModel = (0, mongoose_1.model)("SuperAdmin", superAdminSchema);
