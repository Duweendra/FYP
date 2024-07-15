// src/models/leave.js
import { Schema, model } from "mongoose";

const LeaveSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Leave = model("leave", LeaveSchema);

export default Leave;
