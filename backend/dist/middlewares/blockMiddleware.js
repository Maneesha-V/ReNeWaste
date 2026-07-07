"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNotBlocked = void 0;
const userModel_1 = require("../models/user/userModel");
const constantUtils_1 = require("../utils/constantUtils");
const wastePlantModel_1 = require("../models/wastePlant/wastePlantModel");
const checkNotBlocked = async (req, res, next) => {
    const id = req.user?.id;
    const role = req.user?.role;
    if (!id || !role) {
        res
            .status(constantUtils_1.STATUS_CODES.UNAUTHORIZED)
            .json({ message: constantUtils_1.MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
    }
    let entity;
    if (role === "user") {
        entity = await userModel_1.UserModel.findById(id);
    }
    else if (role === "wasteplant") {
        entity = await wastePlantModel_1.WastePlantModel.findById(id);
    }
    else {
        res
            .status(constantUtils_1.STATUS_CODES.FORBIDDEN)
            .json({ message: constantUtils_1.MESSAGES.COMMON.ERROR.INVALID_ROLE });
        return;
    }
    if (!entity || entity.isBlocked) {
        res
            .status(constantUtils_1.STATUS_CODES.FORBIDDEN)
            .json({ message: constantUtils_1.MESSAGES.COMMON.ERROR.BLOCKED });
        return;
    }
    next();
};
exports.checkNotBlocked = checkNotBlocked;
