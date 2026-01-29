import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { getIO } from "../socket.js";

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

    const fullMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("chat");

    const io = getIO();
    io.to(chatId).emit("new-message", fullMessage);

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error("Send message error", error);
    res.status(500).json({ message: "Server error" });
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

export const markAsSeen = async (req, res) => {
  try {
    const { chatId } = req.body;

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
    const io = getIO();
    io.to(chatId).emit("messages-seen", { chatId });

    res.sendStatus(200);
  } catch (error) {
    console.error("Seen update error", error);
    res.sendStatus(500);
  }
};
