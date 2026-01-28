import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { getMessages, sendMessage } from "../../api/message.api";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../../context/AuthContext";
import ChatInput from "./ChatInput";
import socket from "../../socket";

const MessageList = ({ chatId, onNewMessage }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("OPENED CHAT ID:", chatId);


  const bottomRef = useRef(null);

  // this useEffect is used - whenever chat changes it load messages
  useEffect(() => {
    if (!chatId) return;

    // reset state on chat change
    setMessages([])
    setLoading(true);

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

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSendMessage = async (text) => {
    try {
      const newMessage = await sendMessage({
        chatId,
        content: text,
      });

      setMessages((prev) => [...prev, newMessage]);
      onNewMessage(chatId, newMessage.content);
    } catch (error) {
      console.error("Failed to send message");
    }
  };

  // Join socket room when chat opens
  useEffect(() => {
    if (!chatId) return;
    socket.emit("join-chat", chatId);
  }, [chatId]);

  // listen for incoming socket messages 
  useEffect(() => {
    if (!chatId) return;

    const handleSocketMessage = (message) => {
      console.log("RECEIVED SOCKET MESSAGE:", message);

      // ignore messages from other chats
      if (String(message.chat._id) !== String(chatId)) return;

      // ignore messages sent by itself (already added via REST)
      if (String(message.sender._id) === String(user._id)) return;

      setMessages((prev) => [...prev, message]);
      setLoading(false)
      // tells Chat.jsx "I have a new message"
      onNewMessage(chatId, message.content);
    };

    socket.on("new-message", handleSocketMessage);

    return () => {
      socket.off("new-message", handleSocketMessage);
    };
  }, [chatId, user._id]);

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
            isOwn={String(msg.sender._id) === String(user._id)}
          />
        ))}

        {/* taking message input */}
        <div ref={bottomRef}></div>
      </div>
      <ChatInput onSend={handleSendMessage} />
    </>
  );
};

export default MessageList;
