import { Router } from "express";
import {
  calAttendance,
  createAttendanceLog,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createAttendanceLog);
router.post("/calAttendance", calAttendance);

export default router;
