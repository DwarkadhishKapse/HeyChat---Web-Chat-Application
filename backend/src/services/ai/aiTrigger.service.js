import { buildAIContext } from "../ai/contextBuilder.service.js";

export const triggerAIResponse = async ({ chatId, senderId, message }) => {
  console.log("🤖 AI trigger fired");
  console.log("Chat ID:", chatId);
  console.log("Sender ID:", senderId);
  console.log("Message:", message);

  const context = await buildAIContext(chatId);

  console.log("AI Context:");
  console.log(JSON.stringify(context, null, 2));
};
