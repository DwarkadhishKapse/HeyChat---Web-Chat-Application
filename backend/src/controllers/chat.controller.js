import Chat from "../models/chat.model.js";
import { heyAIUser } from "../utils/heyAIUser.js";

export const createOrGetChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    // get HeyAI user once
    const heyAI = await heyAIUser();

    // Check if chat exists (exactly 2 participants)
    let chat = await Chat.findOne({
      isGroupChat: false,

      // size: 2 guarantees 1 to 1 chat
      participants: { $size: 2, $all: [req.user._id, userId] },
    }).populate("participants", "-password");

    if (chat) {
      return res.status(200).json(chat);
    }

    // checking, if this chat is with heyAI
    const isAIChat = String(userId) === String(heyAI._id);

    // create new chat
    const newChat = await Chat.create({
      participants: [req.user._id, userId],
      isGroupChat: false,
      unreadCount: {
        [req.user._id]: 0,
        [userId]: 0,
      },
      ...(isAIChat && {
        lastMessage: "HeyAI is ready 🤖",
        lastMessageAt: new Date(),
      }),
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "participants",
      "-password",
    );

    res.status(201).json(fullChat);
  } catch (error) {
    console.error("Create chat error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyChats = async (req, res) => {
  try {
    // ensure HeyAI exists
    const heyAI = await heyAIUser();

    // ensure HeyAI chat exists for this user
    const aiChatExists = await Chat.findOne({
      isGroupChat: false,
      participants: { $size: 2, $all: [req.user._id, heyAI._id] },
    });

    if (!aiChatExists) {
      await Chat.create({
        participants: [req.user._id, heyAI._id],
        isGroupChat: false,
        unreadCount: {
          [req.user._id]: 0,
          [heyAI._id]: 0,
        },
        lastMessage: "HeyAI is ready 🤖",
        lastMessageAt: new Date(),
      });
    }

    // fetch all chats for user
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .sort({ lastMessageAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Get chats error", error);
    res.status(500).json({ message: "Server error" });
  }
};
