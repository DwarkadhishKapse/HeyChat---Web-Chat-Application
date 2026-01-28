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
