"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema_1 = require("./notificationSchema");
exports.NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema_1.NotificationSchema);
