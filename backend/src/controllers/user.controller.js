import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    res.status(201).json(users);
  } catch (error) {
    console.error("Get users error", error);
    res.status(500).json({ message: "Server error" });
  }
};
