import Chat from "../models/chat.model.js";

export const createOrGetChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    // Check if chat exists (exactly 2 participants)
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $size: 2, $all: [req.user._id, userId] },
    }).populate("participants", "-password");

    if (chat) {
      return res.status(200).json(chat);
    }

    // create new chat
    const newChat = await Chat.create({
      participants: [req.user._id, userId],
      isGroupChat: false,
      unreadCount: {
        [req.user._id]: 0,
        [userId]: 0,
      },
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
    const chats = await Chat.find({
      // find chat where im participate
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
