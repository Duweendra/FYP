// src/routes/userRoutes.js

import { Router } from "express";
import { getLeaveCountByDayForLastMonth } from "../controllers/userController.js";

const router = Router();

router.post("/getleaves", getLeaveCountByDayForLastMonth);

export default router;
