import { Router } from "express";
import { createAttendanceLog } from "../controllers/userController.js";

const router = Router();

router.post("/", createAttendanceLog);

export default router;
