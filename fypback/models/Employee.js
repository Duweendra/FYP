// src/models/user.js

import { Schema, model } from 'mongoose';

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  JobTitle: {
    type: String,
    required: true,
  },
  EmployeeStatus: {
    type: String,
    required: true,
  },
  image: {
    type: String
  }
}, {
  timestamps: true,
});

const Employee = model('employee', EmployeeSchema);

export default Employee;
