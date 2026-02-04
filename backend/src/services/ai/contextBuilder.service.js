import Message from "../../models/message.model.js";

const SYSTEM_PROMPT = `
You are HeyAI, a helpful and concise AI assistant inside a chat application.

Rules:
- Format responses using Markdown.
- Use short paragraphs.
- Use bullet points where appropriate.
- Do NOT write everything in one paragraph.
- Answer like a normal chat participant.
`;

export const buildAIContext = async (chatId) => {
  try {
    if (!chatId) return [];
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("sender", "isAI");

    // AI must see messages from oldest -> newest
    messages.reverse();

    const context = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];

    for (const msg of messages) {
      //
      if (!msg.content) continue;

      context.push({
        role: msg.sender.isAI ? "assistant" : "user",
        content: msg.content,
      });
    }
    return context;
  } catch (error) {
    console.error("Failed to build AI context:", error);
    return [];
  }
};
