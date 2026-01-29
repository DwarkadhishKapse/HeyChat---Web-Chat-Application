import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  sendMessage,
  getMessages,
  markAsDelivered,
  markAsSeen,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessages);
router.post("/delivered", protect, markAsDelivered);
router.post("/seen", protect, markAsSeen);

export default router;
