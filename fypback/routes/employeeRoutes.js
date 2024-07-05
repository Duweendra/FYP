// src/routes/userRoutes.js

import { Router } from 'express';
import { getUsers, createUser, loginUser, getEmployee, createEmployee } from "../controllers/userController.js";
import upload from '../config/multer.js';
const router = Router(); 

router.post('/', upload.single("image"), createEmployee);
router.get('/', getEmployee);
export default router;               