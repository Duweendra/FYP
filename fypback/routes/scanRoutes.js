// src/routes/userRoutes.js

import { Router } from 'express';
import { getUsers, createUser, loginUser, createScan, getScan } from "../controllers/userController.js";
import upload from '../config/multer.js';
const router = Router();

router.post('/', upload.single("image"), createScan);
router.get('/', getScan);
export default router; 