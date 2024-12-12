import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;  // Use a default port if not provided in .env

// Middleware to parse incoming JSON requests
app.use(express.json());  // Add this line to parse JSON body requests

// Middleware to parse cookies from the request
app.use(cookieParser());

// Use the authentication routes
app.use("/api/auth", authRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
