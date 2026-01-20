import React, { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../api/message.api";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../../context/AuthContext";
import ChatInput from "./ChatInput";

const MessageList = ({ chatId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // this useEffect is used - whenever chat changes it load messages
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(chatId);
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async (text) => {
    try {
      const newMessage = await sendMessage({
        chatId,
        content: text,
      });

      setMessages(prev => [...prev, newMessage]);
      console.log("Sending message:", text);
    } catch (error) {
      console.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 overflow-y-auto flex-col">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            text={msg.content}
            time={new Date(msg.createdAt).toLocaleTimeString()}
            isOwn={msg.sender._id === user._id}
          />
        ))}

        {/* taking message input */}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </>
  );
};

export default MessageList;
