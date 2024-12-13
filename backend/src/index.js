import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use a default port if not provided in .env

app.use(express.json()); // Middleware to parse incoming JSON requests

app.use(cookieParser()); // Middleware to parse cookies from the request
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // Middleware to enable CORS

app.use("/api/auth", authRoutes); // Use the authentication routes

app.use("/api/messages", messageRoutes); // Use the message routes

// Start the server and connect to the database
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
