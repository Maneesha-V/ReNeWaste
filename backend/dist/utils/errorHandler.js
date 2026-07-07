"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = handleControllerError;
function handleControllerError(error, res, status) {
    if (isAxiosError(error)) {
        console.error("Axios Error:", error.message);
        res.status(status).json({ message: error.message });
    }
    else if (error instanceof Error) {
        console.error("Unhandled Error:", error.message);
        res.status(status).json({ message: error.message });
    }
    else {
        console.error("Unknown Error:", error);
        res.status(status).json({ message: "An unknown error occurred" });
    }
}
function isAxiosError(error) {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
}
