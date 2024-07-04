// src/models/user.js

import { Schema, model } from 'mongoose';

const ScanSchema = new Schema({
  pid: {
    type: String,
  },
  note: {
    type: String,
  },
  prediction: {
    type: String,
    required: true,
  },
  probability: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

const Scan = model('scan', ScanSchema);

export default Scan;
