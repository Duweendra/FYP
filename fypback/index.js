import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import rfidRoutes from "./routes/rfidRoutes.js";
import Cors from "cors";
import morgan from "morgan";
// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(Cors());
// Middleware to parse JSON
app.use(express.json());
// Use morgan to log all requests
app.use(morgan("combined"));
// Routes
app.use("/api/users", userRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/rfid", rfidRoutes);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
