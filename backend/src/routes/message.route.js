import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages, 
  sendMessage
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar); // Get users for sidebar
router.get("/:id", protectRoute, getMessages); // Get messages
router.post("/send/:id", protectRoute, sendMessage); // Send a message

export default router;
