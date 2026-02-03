import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const heyAIUser = async () => {
  try {
    // check heyAIUser is already exist or not
    let heyAIUser = await User.findOne({ isAI: true });

    if (heyAIUser) {
      return heyAIUser;
    }

    // Create heyAI user
    const randomPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    heyAIUser = await User.create({
      name: "HeyAI",
      email: "heyai@system.local",
      password: hashedPassword,
      isAI: true,
      avatar: "",
    });

    console.log("HeyAI system user created");

    return heyAIUser;
  } catch (error) {
    console.log("Failed to ensure HeyAI user:", error);
    throw error;
  }
};
