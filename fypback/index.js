import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import Cors from 'cors'
// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(Cors())
// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/scan', scanRoutes);
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
