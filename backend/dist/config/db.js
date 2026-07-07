"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGODB_URI as string);
        // console.log("Connected to MongoDB");
        const uri = process.env.MONGODB_URI;
        if (!uri)
            throw new Error("MONGODB_URI is not defined");
        const conn = await mongoose_1.default.connect(uri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
