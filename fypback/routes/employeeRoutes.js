// src/routes/userRoutes.js

import { Router } from "express";
import {
  createLeave,
  getUsers,
  createUser,
  loginUser,
  getEmployee,
  createOrUpdateEmployee,
  getLeave,
  createOrUpdateAttendance,
  getAttendance,
  createPayroll,
  getPayroll,
  deleteEmployee,
  deleteLeave,
} from "../controllers/userController.js";
import upload from "../config/multer.js";
const router = Router();

router.post("/", upload.single("image"), createOrUpdateEmployee);
router.get("/", getEmployee);
router.post("/leave", createLeave);
router.get("/leave", getLeave);
router.post("/attendance", createOrUpdateAttendance);
router.get("/attendance", getAttendance);
router.post("/payroll", createPayroll);
router.get("/payroll", getPayroll);
router.post("/:id", deleteEmployee);
router.post("/leave/:id", deleteLeave);

export default router;
