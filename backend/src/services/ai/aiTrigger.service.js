import Message from "../../models/message.model.js";
import Chat from "../../models/chat.model.js";
import { getIO } from "../../socket.js";
import { heyAIUser } from "../../utils/heyAIUser.js";
import { buildAIContext } from "../ai/contextBuilder.service.js";
import { getAIReply } from "./gemini.service.js";

// this is helper for fake typing delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const triggerAIResponse = async ({ chatId }) => {
  let io;

  // if socket is not ready
  try {
    io = getIO();
  } catch (error) {
    console.log("Socket is not initialized, skipping AI response");
    return;
  }

  try {
    // Get HeyAI user
    const heyAI = await heyAIUser();

    // Build AI context (memory)
    const context = await buildAIContext(chatId);

    if (!context || context.length === 0) {
      console.warn("AI context is empty");
      return;
    }

    // Start typing Indicator (for AI)
    io.to(chatId).emit("ai-typing-start", { chatId });

    // Get AI reply
    const aiReply = await getAIReply(context);
    if (!aiReply) return;

    // Fake typing delay
    const typingDelay = Math.min(2000, aiReply.length * 30);
    await sleep(typingDelay);

    // Create AI message
    const aiMessage = await Message.create({
      chat: chatId,
      sender: heyAI._id,
      content: aiReply,
      messageType: "text",
      delivered: true,
      deliveredAt: new Date(),
    });

    // Update chat metadata
    const chat = await Chat.findById(chatId);
    if (!chat) return;

    chat.lastMessage = aiReply;
    chat.lastMessageAt = new Date();

    // Finding human receiver
    const receiverId = chat.participants.find(
      (id) => id.toString() !== heyAI._id.toString(),
    );

    // here Socket logic (same like as other users)
    const room = io.sockets.adapter.rooms.get(chatId);
    let receiverInRoom = false;

    if (room) {
      for (const socketId of room) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket?.userId === receiverId.toString()) {
          receiverInRoom = true;
          break;
        }
      }
    }

    // Unread Count
    if (!receiverInRoom) {
      // get the current unread count (message count)
      const currentUnread = chat.unreadCount.get(receiverId.toString()) || 0;

      chat.unreadCount.set(receiverId.toString(), currentUnread + 1);

      io.to(receiverId.toString()).emit("unread-count-updated", {
        chatId,
        unreadCount: chat.unreadCount.get(receiverId.toString()),
      });
    }

    await chat.save();

    // Populate and emit Message
    const fullAIMessage = await Message.findById(aiMessage._id)
      .populate("sender", "name email")
      .populate("chat");

    io.to(chatId).emit("new-message", fullAIMessage);
  } catch (error) {
    console.error("AI message flow failed:", error);
  } finally {
    io.to(chatId).emit("ai-typing-stop", { chatId });
  }
};
