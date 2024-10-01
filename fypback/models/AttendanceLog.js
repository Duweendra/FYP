// src/models/attendance.js
import { Schema, model } from "mongoose";

const AttendanceLogSchema = new Schema(
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
    rfid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceLog = model("attendancelog", AttendanceLogSchema);

export default AttendanceLog;
