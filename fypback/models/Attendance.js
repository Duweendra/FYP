// src/models/attendance.js
import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "Leave", "Half-day"], // You can add more statuses if needed
      default: "Present",
    },
    regularTime: {
      type: Number, // Number of hours of regular work
      default: 0,
    },
    extraTime: {
      type: Number, // Number of extra hours worked
      default: 0,
    },
    totalLeaveTime: {
      type: Number, // Number of hours on leave
      default: 0,
    },
    totalTime: {
      type: Number, // Total hours (Regular Time + Extra Time - Total Leave Time)
      default: function () {
        return this.regularTime + this.extraTime - this.totalLeaveTime;
      },
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = model("attendance", AttendanceSchema);

export default Attendance;
