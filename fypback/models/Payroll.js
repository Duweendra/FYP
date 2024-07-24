// src/models/leave.js
import { Schema, model } from "mongoose";

const PayrollSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    payPeriodStart: Date,
    payPeriodEnd: Date,
    regularHours: Number,
    overtimeHours: Number,
    totalHours: Number,
    grossSalary: Number,
    taxes: Number,
    netSalary: Number,
  },
  {
    timestamps: true,
  }
);

const Payroll = model("payroll", PayrollSchema);

export default Payroll;
