// src/controllers/userController.js
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Scan from "../models/Scans.js";
import upload from "../config/multer.js";
import multer from "multer";
import path from "path";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
      { id: user.id },
      process.env.TOKEN_SECRECT || "wateveris"
    );
    const { password: _, ...userDetails } = user.toObject();
    res.status(201).json({ accessToken: token, userinfo: userDetails });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createLeave = async (req, res) => {
  const { id, employeeId, leaveType, startDate, endDate, reason, status } =
    req.body;

  try {
    console.log(req.body);
    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (id == -1 || id == null) {
      // Create a new leave record
      const leave = new Leave({
        employee: employeeId,
        leaveType,
        startDate,
        endDate,
        reason,
        status: "Pending",
      });
      await leave.save();
      res.status(201).json({ leaveInfo: leave });
    } else {
      const updatedLeave = await Leave.findByIdAndUpdate(
        id,
        {
          employee: employeeId,
          leaveType,
          startDate,
          endDate,
          reason,
          status,
        },
        { new: true }
      );

      if (!updatedLeave) {
        return res.status(404).json({ message: "Leave not found" });
      }

      res.status(200).json({ leaveinfo: updatedLeave });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLeave = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const leaves = await Leave.find()
      .limit(limit)
      .skip(startIndex)
      .populate("employee");

    const totalleaves = await Leave.countDocuments();
    const totalPages = Math.ceil(totalleaves / limit);

    res.json({
      currentPage: page,
      totalPages: totalPages,
      totalLeaves: totalleaves,
      leaves: leaves,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default createLeave;

const createOrUpdateEmployee = async (req, res) => {
  const { id, name, JobTitle, JoinedDate, EmployeeStatus } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    if (id == -1 || id == null) {
      // Create a new employee
      const newEmployee = new Employee({
        name,
        JobTitle,
        JoinedDate,
        EmployeeStatus,
        image: imagePath,
      });
      await newEmployee.save();
      res.status(201).json({ employeeinfo: newEmployee });
    } else {
      // Update existing employee
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        {
          name,
          JobTitle,
          JoinedDate,
          EmployeeStatus,
          image: imagePath,
        },
        { new: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({ employeeinfo: updatedEmployee });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const employees = await Employee.find().limit(limit).skip(startIndex);

    const totalEmployees = await Employee.countDocuments();
    const totalPages = Math.ceil(totalEmployees / limit);

    res.json({
      currentPage: page,
      totalPages: totalPages,
      totalEmployees: totalEmployees,
      employees: employees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.TOKEN_SECRECT || "wateveris"
    );

    // Password is correct, return user details (without the password)
    const { password: _, ...userDetails } = user.toObject();
    res.status(200).json({ accessToken: token, userinfo: userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getUsers,
  createUser,
  loginUser,
  createOrUpdateEmployee,
  getEmployee,
  createLeave,
  getLeave,
};
