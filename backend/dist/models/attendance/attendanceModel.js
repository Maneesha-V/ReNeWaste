"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModel = void 0;
const mongoose_1 = require("mongoose");
const attendanceSchema_1 = require("./attendanceSchema");
exports.AttendanceModel = (0, mongoose_1.model)("Attendance", attendanceSchema_1.attendanceSchema);
