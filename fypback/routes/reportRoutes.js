// src/routes/userRoutes.js

import { Router } from "express";
import {
  getAttendanceCountByDayForLastThreeMonths,
  getLeaveCountByDayForLastMonth,
} from "../controllers/userController.js";

const router = Router();

router.post("/getleaves", getLeaveCountByDayForLastMonth);
router.post("/getattendances", getAttendanceCountByDayForLastThreeMonths);

export default router;
