// src/routes/userRoutes.js

import { Router } from "express";
import {
  getAttendanceCountByDayForLastThreeMonths,
  getLeaveCountByDayForLastMonth,
  getTotalAttendanceChartData,
} from "../controllers/userController.js";

const router = Router();

router.post("/getleaves", getLeaveCountByDayForLastMonth);
router.post("/getattendances", getAttendanceCountByDayForLastThreeMonths);
router.post("/getattendancerates", getTotalAttendanceChartData);
export default router;
