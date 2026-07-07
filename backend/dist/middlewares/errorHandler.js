"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const errorHandler = (err, req, res, next) => {
    if (isAxiosError(err)) {
        res
            .status(502)
            .json({ message: "External API error", detail: err.message });
        return;
    }
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    if (err instanceof Error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: "An unknown error occurred" });
};
exports.errorHandler = errorHandler;
function isAxiosError(error) {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
}
