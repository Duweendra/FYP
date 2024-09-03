// src/models/attendance.js
import { Schema, model } from "mongoose";

const RFIDSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "employee",
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

const RFID = model("rfid", RFIDSchema);

export default RFID;
