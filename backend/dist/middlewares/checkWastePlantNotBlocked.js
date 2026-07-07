"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWastePlantNotBlocked = void 0;
const wastePlantModel_1 = require("../models/wastePlant/wastePlantModel");
const userModel_1 = require("../models/user/userModel");
const constantUtils_1 = require("../utils/constantUtils");
const checkWastePlantNotBlocked = async (req, res, next) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (role !== "user") {
        return next();
    }
    const user = await userModel_1.UserModel.findById(userId);
    if (!user || !user.wasteplantId) {
        res
            .status(constantUtils_1.STATUS_CODES.FORBIDDEN)
            .json({ message: constantUtils_1.MESSAGES.USER.ERROR.NOT_FOUND });
        return;
    }
    const wastePlant = await wastePlantModel_1.WastePlantModel.findById(user.wasteplantId);
    console.log("wastePlant12", wastePlant);
    if (!wastePlant) {
        res
            .status(constantUtils_1.STATUS_CODES.FORBIDDEN)
            .json({ message: constantUtils_1.MESSAGES.WASTEPLANT.ERROR.NOT_FOUND });
        return;
    }
    if (wastePlant.isBlocked) {
        res.status(constantUtils_1.STATUS_CODES.FORBIDDEN).json({
            reason: "WASTEPLANT_BLOCKED",
            message: constantUtils_1.MESSAGES.USER.ERROR.WASTEPLANT_BLOCK,
        });
        return;
    }
    next();
};
exports.checkWastePlantNotBlocked = checkWastePlantNotBlocked;
