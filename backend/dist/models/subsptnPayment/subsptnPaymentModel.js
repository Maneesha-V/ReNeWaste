"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPaymentModel = void 0;
const mongoose_1 = require("mongoose");
const subsptnPaymentSchema_1 = require("./subsptnPaymentSchema");
exports.SubscriptionPaymentModel = (0, mongoose_1.model)("SubscriptionPayment", subsptnPaymentSchema_1.SubscriptionPaymentSchema);
