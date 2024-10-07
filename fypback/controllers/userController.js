// src/controllers/userController.js
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";
import Payroll from "../models/Payroll.js";
import RFID from "../models/Rfid.js";
import AttendanceLog from "../models/AttendanceLog.js";
import moment from "moment";

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

const createOrUpdateAttendance = async (req, res) => {
  const {
    id,
    employeeId,
    date,
    status,
    regularTime,
    extraTime,
    totalLeaveTime,
    notes,
  } = req.body;

  try {
    console.log(req.body);
    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Calculate totalTime
    const totalTime =
      (regularTime || 0) + (extraTime || 0) - (totalLeaveTime || 0);

    if (id == -1 || id == null) {
      // Create a new attendance record
      const attendance = new Attendance({
        employee: employeeId,
        date,
        status,
        regularTime,
        extraTime,
        totalLeaveTime,
        totalTime,
        notes,
      });
      await attendance.save();
      res.status(201).json({ attendanceInfo: attendance });
    } else {
      const updatedAttendance = await Attendance.findByIdAndUpdate(
        id,
        {
          employee: employeeId,
          date,
          status,
          regularTime,
          extraTime,
          totalLeaveTime,
          totalTime,
          notes,
        },
        { new: true }
      );

      if (!updatedAttendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      res.status(200).json({ attendanceInfo: updatedAttendance });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const attendances = await Attendance.find()
      .limit(limit)
      .skip(startIndex)
      .populate("employee");

    const totalAttendances = await Attendance.countDocuments();
    const totalPages = Math.ceil(totalAttendances / limit);

    res.json({
      currentPage: page,
      totalPages: totalPages,
      totalAttendances: totalAttendances,
      attendances: attendances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const createOrUpdateEmployee = async (req, res) => {
  const {
    id,
    name,
    JobTitle,
    NIC,
    JoinedDate,
    EmployeeStatus,
    email,
    password,
    isAdmin,
  } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    if (id == -1 || id == null) {
      // Create a new employee
      const newEmployee = new Employee({
        name,
        JobTitle,
        JoinedDate,
        NIC,
        EmployeeStatus,
        image: imagePath,
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      await newEmployee.save();

      const user = new User({
        name,
        email,
        password: hashedPassword,
        employee: newEmployee,
        isAdmin: isAdmin,
      });
      await user.save();
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

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("employee"); // Use populate if you want employee details as well
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editUserById = async (req, res) => {
  const { _id, name, email, EmployeeStatus, NIC, JobTitle } = req.body;
  try {
    // Start transaction for atomic updates
    const session = await User.startSession();
    session.startTransaction();

    // Fetch user by ID
    const user = await User.findById(_id).populate("employee");
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Update User details
    if (name) user.name = name;
    if (email) user.email = email;
    // Update Employee details if provided
    if (user.employee) {
      const employee = await Employee.findById(user.employee._id);

      if (!employee) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Employee not found" });
      }

      // Update employee fields if they are provided
      if (name) employee.name = name;
      if (JobTitle) employee.JobTitle = JobTitle;
      if (NIC) employee.NIC = NIC;
      if (EmployeeStatus) employee.EmployeeStatus = EmployeeStatus;
      // Save the updated employee details
      await employee.save({ session });
    }
    // Save the updated user details
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "User and employee details updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email }).populate("employee");
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

const createPayroll = async (req, res) => {
  const { employeeId, payPeriodStart, payPeriodEnd } = req.body;

  try {
    let employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    let timeRecords = await Attendance.find({
      employee: employee.id,
      date: { $gte: payPeriodStart, $lte: payPeriodEnd },
    });

    let regularHours = timeRecords.reduce(
      (sum, record) => sum + record.regularTime,
      0
    );
    let overtimeHours = timeRecords.reduce(
      (sum, record) => sum + record.extraTime,
      0
    );

    let regularSalary = regularHours * employee.salaryRate;
    let overtimeSalary = overtimeHours * employee.overtimeRate;
    let grossSalary = regularSalary + overtimeSalary;

    let taxes = calculateTaxes(grossSalary);
    let netSalary = grossSalary - taxes;

    let payrollRecord = new Payroll({
      employee,
      payPeriodStart,
      payPeriodEnd,
      regularHours,
      overtimeHours,
      totalHours: regularHours + overtimeHours,
      grossSalary,
      taxes,
      netSalary,
    });

    await payrollRecord.save();
    res.status(200).json({ payrollRecord: payrollRecord });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPayroll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const payrolls = await Payroll.find()
      .limit(limit)
      .skip(startIndex)
      .populate("employee");

    const totalPayrolls = await Payroll.countDocuments();
    const totalPages = Math.ceil(totalPayrolls / limit);

    res.json({
      currentPage: page,
      totalPages: totalPages,
      totalPayrolls: totalPayrolls,
      payrolls: payrolls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateTaxes = (grossSalary) => {
  const taxRate = 0.2; // Example tax rate
  return grossSalary * taxRate;
};

const createAttendanceLog = async (req, res) => {
  const { id } = req.body;

  try {
    const rfid = await RFID.findOne({ rfid: id });
    console.log("rfid", id);
    if (!rfid) {
      return res.status(404).json({ message: "RFID not found" });
    }
    const employee = await Employee.findById(rfid.employee);
    console.log("rfid", employee);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const newlog = new AttendanceLog({
      employee: employee,
      date: new Date(),
      rfid: rfid.rfid,
    });
    await newlog.save();

    res.status(200).json({ newlog: newlog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to calculate hours between two dates
function calculateHours(startTime, endTime) {
  const diffMs = endTime - startTime;
  return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
}

async function processAttendance2(date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    const logs = await AttendanceLog.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Group logs by employee
    const logsByEmployee = logs.reduce((acc, log) => {
      const employeeId = log.employee.toString();
      if (!acc[employeeId]) {
        acc[employeeId] = [];
      }
      acc[employeeId].push(log);
      return acc;
    }, {});

    // Process each employee's logs
    for (const employeeId in logsByEmployee) {
      const employeeLogs = logsByEmployee[employeeId];

      if (employeeLogs.length < 2) {
        console.log(
          `Not enough logs for employee ${employeeId} to calculate attendance.`
        );
        continue; // Skip processing if there's not enough logs (at least 2 logs are needed for start and end times)
      }

      // Sort logs by createdAt to ensure correct start and end times
      employeeLogs.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      // Calculate total time worked based on the first log (start) and the last log (end)
      const startTime = new Date(employeeLogs[0].createdAt);
      const endTime = new Date(employeeLogs[employeeLogs.length - 1].createdAt);
      const totalTimeWorked = calculateHours(startTime, endTime);

      // Calculate regular time, extra time, and leave time
      const regularTime = Math.min(totalTimeWorked, 8); // Cap at 8 hours
      const extraTime = Math.max(totalTimeWorked - 8, 0); // Anything over 8 hours
      const totalLeaveTime = Math.max(8 - totalTimeWorked, 0); // If less than 8 hours

      // Determine attendance status
      const status = totalTimeWorked > 0 ? "Present" : "Absent";

      // Check if an attendance record already exists for this employee on the specified date
      let attendance = await Attendance.findOne({
        employee: employeeId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      if (attendance) {
        // Update existing attendance record
        attendance.status = status;
        attendance.regularTime = regularTime;
        attendance.extraTime = extraTime;
        attendance.totalLeaveTime = totalLeaveTime;
        attendance.totalTime = totalTimeWorked;
      } else {
        // Create a new attendance record
        attendance = new Attendance({
          employee: employeeId,
          date,
          status,
          regularTime,
          extraTime,
          totalLeaveTime,
          totalTime: totalTimeWorked,
        });
      }

      // Save the attendance record
      await attendance.save();
      console.log(`Attendance saved for employee ${employeeId}.`);
    }

    console.log("Attendance processing complete.");
  } catch (error) {
    console.error("Error processing attendance:", error);
  }
}

//calpayroll
const calculatePayroll = async (employeeId, payPeriodStart, payPeriodEnd) => {
  try {
    // Fetch attendance records for the employee during the pay period
    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: { $gte: payPeriodStart, $lte: payPeriodEnd },
    });

    if (!attendanceRecords.length) {
      throw new Error("No attendance records found for this period.");
    }

    // Fetch employee details (e.g., hourly rate)
    const employee = await Employee.findById(employeeId);
    if (!employee) throw new Error("Employee not found");

    const hourlyRate = employee.hourlyRate; // Assume the employee model contains hourlyRate
    const overtimeRate = 1.5 * hourlyRate; // Overtime rate, assuming 1.5x regular rate

    let totalRegularHours = 0;
    let totalOvertimeHours = 0;

    // Loop through the attendance records to calculate total hours
    attendanceRecords.forEach((record) => {
      totalRegularHours += record.regularTime;
      totalOvertimeHours += record.extraTime;
    });

    // Calculate total leave hours (optional based on your leave policy)
    let totalLeaveHours = attendanceRecords.reduce(
      (acc, record) => acc + record.totalLeaveTime,
      0
    );

    // Calculate total worked hours excluding leave
    const totalWorkedHours =
      totalRegularHours + totalOvertimeHours - totalLeaveHours;

    // Calculate salary
    const regularSalary = totalRegularHours * hourlyRate;
    const overtimeSalary = totalOvertimeHours * overtimeRate;
    const grossSalary = regularSalary + overtimeSalary;

    const taxes = grossSalary * 0.2; // Assume 20% tax deduction (can be adjusted)
    const netSalary = grossSalary - taxes;

    // Save payroll record in the database
    const payrollRecord = new Payroll({
      employee: employeeId,
      payPeriodStart,
      payPeriodEnd,
      regularHours: totalRegularHours,
      overtimeHours: totalOvertimeHours,
      totalHours: totalWorkedHours,
      grossSalary,
      taxes,
      netSalary,
    });

    await payrollRecord.save();
    return payrollRecord;
  } catch (error) {
    console.error("Error calculating payroll:", error);
    throw error;
  }
};

const calAttendance = async (req, res) => {
  const { date } = req.body;

  try {
    const todayDate = new Date();
    let newlog = "";
    if (date && date !== null) {
      newlog = await processAttendance2(date);
    } else {
      newlog = await processAttendance2(todayDate);
    }
    res.status(200).json({ newlog: newlog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLeaveCountByDayForLastMonth = async (req, res) => {
  try {
    // Get the current date and the date 1 month ago
    const today = moment().endOf("day");
    const lastMonth = moment().subtract(3, "months").startOf("day");

    // Query to find all leaves that occurred in the last month
    const leaves = await Leave.find({
      startDate: { $gte: lastMonth.toDate(), $lte: today.toDate() },
    });

    // Group the leaves by day
    const leaveCountByDay = {};
    for (let leave of leaves) {
      // Use moment to format the start date to a day string
      const leaveDay = moment(leave.startDate).format("YYYY-MM-DD");

      // Initialize the count for that day if it doesn't exist
      if (!leaveCountByDay[leaveDay]) {
        leaveCountByDay[leaveDay] = 0;
      }

      leaveCountByDay[leaveDay]++;
    }

    res.status(200).json({ leaveCountByDay });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getUsers,
  calAttendance,
  createUser,
  createPayroll,
  loginUser,
  createOrUpdateEmployee,
  getEmployee,
  createLeave,
  getPayroll,
  getLeave,
  getUserById,
  createOrUpdateAttendance,
  getAttendance,
  createAttendanceLog,
  calculatePayroll,
  editUserById,
  getLeaveCountByDayForLastMonth,
};
