// src/models/user.js

import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const EmployeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    EID: {
      type: String,
      required: true,
      unique: true,
      default: () => `E${uuidv4().split("-")[0]}`,
    },
    DOB: {
      type: Date,
    },
    JoinedDate: {
      type: Date,
    },
    ProbationEndDate: {
      type: Date,
    },
    NIC: {
      type: String,
    },
    JobTitle: {
      type: String,
      required: true,
    },
    EmployeeStatus: {
      type: String,
      required: true,
    },
    salaryRate: Number,
    overtimeRate: Number,
    image: {
      type: String,
    },
    rfid: {
      type: Schema.Types.ObjectId,
      ref: "rfid",
    },
  },
  {
    timestamps: true,
  }
);

const Employee = model("employee", EmployeeSchema);

export default Employee;
