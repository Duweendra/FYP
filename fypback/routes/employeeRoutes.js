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
} from "../controllers/userController.js";
import upload from "../config/multer.js";
const router = Router();

router.post("/", upload.single("image"), createOrUpdateEmployee);
router.get("/", getEmployee);
router.post("/leave", createLeave);
router.get("/leave", getLeave);
export default router;
