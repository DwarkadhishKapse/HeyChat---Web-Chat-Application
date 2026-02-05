import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { getIO } from "../socket.js";
import User from "../models/user.model.js";
import { triggerAIResponse } from "../services/ai/aiTrigger.service.js";

/* send message controller -
  Handles - Message creation, Unread count increment, socket events
*/
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res
        .status(400)
        .json({ message: "Chat ID and content are required" });
    }

    // creating message
    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
    });

    // now chats always knows its latest message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: content,
      lastMessageAt: new Date(),
    });

    // populate message for frontend
    const fullMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("chat");

    // fetch chat to identify receiver
    const chat = await Chat.findById(chatId);
    const senderId = req.user._id.toString();

    const receiverId = chat.participants.find(
      (id) => id.toString() !== senderId,
    );

    // socket instance
    const io = getIO();

    // here check if receiver is inside this chat room
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

    /* Here I implement Unread logic
      If receiver not in chat -> unread count
      If receiver in chat -> do nothing
    */

    if (!receiverInRoom) {
      const currentUnread = chat.unreadCount.get(receiverId.toString()) || 0;

      chat.unreadCount.set(receiverId.toString(), currentUnread + 1);

      await chat.save();

      // notify receiver sidebar only
      io.to(receiverId.toString()).emit("unread-count-updated", {
        chatId,
        unreadCount: chat.unreadCount.get(receiverId.toString()),
      });
    }

    // Emit message to chat room
    io.to(chatId).emit("new-message", fullMessage);

    res.status(201).json(fullMessage);

    const receiver = await User.findById(receiverId);

    if (receiver.isAI && !req.user.isAI) {
      triggerAIResponse({
        chatId,
        senderId: req.user._id,
        message: content,
      }).catch((error) => {
        console.error("AI trigger failed:", error);
      });
    }
  } catch (error) {
    console.error("Send message error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendFileMessage = async (req, res) => {
  try {
    const { chatId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file received" });
    }

    const messageType = file.mimetype.startsWith("image")
      ? "image"
      : file.mimetype.startsWith("video")
        ? "video"
        : "file";

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      messageType,
      fileUrl: file.path,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: messageType === "file" ? "📎 File" : `📷 ${messageType}`,
      lastMessageAt: new Date(),
    });

    const fullMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("chat");

    const io = getIO();
    io.to(chatId).emit("new-message", fullMessage);

    res.status(200).json(fullMessage);
  } catch (error) {
    console.error("SEND FILE ERROR:", error);
    res.status(500).json({ message: "File send failed" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// This function gets messageId that is delivered and emit message

export const markAsDelivered = async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        delivered: true,
        deliveredAt: new Date(),
      },
      { new: true },
    )
      .populate("sender", "name email")
      .populate("chat");

    if (!message) return res.status(404).json({ message: "Message not found" });

    const io = getIO();
    io.to(message.chat._id.toString()).emit("message-delivered", message);

    res.sendStatus(200);
  } catch (error) {
    console.error("Delivery update error", error);
    res.sendStatus(500);
  }
};

/* This controller handles seen status & Unread count reset */

export const markAsSeen = async (req, res) => {
  try {
    const { chatId } = req.body;

    // Mark message as seen
    await Message.updateMany(
      {
        chat: chatId,
        seen: false,
        sender: { $ne: req.user._id }, // only messages from other user
      },
      {
        seen: true,
        seenAt: new Date(),
      },
    );

    // Reset unread count for this user
    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        [`unreadCount.${req.user._id}`]: 0,
      },
    });

    const io = getIO();

    // Notify chat - seen tick
    io.to(chatId).emit("messages-seen", { chatId });

    // Notify sidebar (clear unread count)
    io.to(req.user._id.toString()).emit("unread-count-reset", {
      chatId,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Seen update error", error);
    res.sendStatus(500);
  }
};
