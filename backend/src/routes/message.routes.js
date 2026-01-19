import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { sendMessage, getMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessage);

export default router;