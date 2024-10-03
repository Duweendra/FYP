// src/routes/userRoutes.js

import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
  getUserById,
  editUserById,
  createOrUpdateEmployee,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/:id", getUserById);

router.post("/:id", editUserById);
export default router;
