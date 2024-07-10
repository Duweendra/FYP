// src/routes/userRoutes.js

import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
  getEmployee,
  createOrUpdateEmployee,
} from "../controllers/userController.js";
import upload from "../config/multer.js";
const router = Router();

router.post("/", upload.single("image"), createOrUpdateEmployee);
router.get("/", getEmployee);
export default router;
