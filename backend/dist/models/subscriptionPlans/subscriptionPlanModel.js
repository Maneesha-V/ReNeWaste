"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanModel = void 0;
const mongoose_1 = require("mongoose");
const subscriptionPlanSchema_1 = require("./subscriptionPlanSchema");
exports.SubscriptionPlanModel = (0, mongoose_1.model)("SubscriptionPlan", subscriptionPlanSchema_1.SubscriptionPlanSchema);
