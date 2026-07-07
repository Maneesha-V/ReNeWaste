"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema_1 = require("./userSchema");
exports.UserModel = (0, mongoose_1.model)("User", userSchema_1.userSchema);
