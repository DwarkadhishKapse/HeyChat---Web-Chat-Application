dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAIReply = async (context) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    // Converting OpenAI style context to -> plain text prompt
    const prompt = context
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("/n");

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Gemini error:", error);
    return "Sorry, I had trouble responding just now.";
  }
};
