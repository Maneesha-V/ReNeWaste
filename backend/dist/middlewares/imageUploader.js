"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const imageStorage = multer_1.default.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|jfif/;
    const extValid = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeValid = allowedTypes.test(file.mimetype);
    if (extValid && mimeValid) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, JPEG, and PNG image files are allowed"));
    }
};
const uploadImages = (0, multer_1.default)({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter,
});
exports.default = uploadImages;
