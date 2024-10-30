// src/routes/userRoutes.js

import { Router } from "express";
import {
  getAttendanceCountByDayForLastThreeMonths,
  getLeaveCountByDayForLastMonth,
  getTotalAttendanceChartData,
  getTotalAttendanceRatioChartData,
} from "../controllers/userController.js";

const router = Router();

router.post("/getleaves", getLeaveCountByDayForLastMonth);
router.post("/getattendances", getAttendanceCountByDayForLastThreeMonths);
router.post("/getattendancerates", getTotalAttendanceChartData);
router.post("/getattendanceratio", getTotalAttendanceRatioChartData);
export default router;
