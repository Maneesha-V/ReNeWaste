import mongoose, { Schema } from "mongoose";
import { IAttendanceDocument } from "./interfaces/attendanceInterface";

export const attendanceSchema: Schema<IAttendanceDocument> = new Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    wasteplantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastePlant",
      required: true,
    },
    assignedTruckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },
    workType: {
      type: String,
      enum: ["fullDay", "halfDay", "noEarning"],
      default: "noEarning",
    },
    totalPickups: {
      type: Number,
      default: 0,
    },
    reward: {
      type: Number,
      default: 0,
    },
    earning: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
