import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import {
  getMessages,
  sendMessage,
  markAsDelivered,
  markSeen,
} from "../../api/message.api";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../../context/AuthContext";
import ChatInput from "./ChatInput";
import socket from "../../socket";

const MessageList = ({ chatId, onNewMessage }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("OPENED CHAT ID:", chatId);

  const bottomRef = useRef(null);

  // this useEffect is used - whenever chat changes it load messages
  useEffect(() => {
    if (!chatId) return;

    setShowTyping(false);

    // reset state on chat change
    setMessages([]);
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

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", ({ chatId: typingChatId }) => {
      if (String(typingChatId) === String(chatId)) {
        setShowTyping(true);
      }
    });

    socket.on("stopTyping", () => {
      setShowTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket]);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, showTyping]);

  const handleSendMessage = async (text) => {
    try {
      const newMessage = await sendMessage({
        chatId,
        content: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          delivered: false,
          seen: false,
        },
      ]);
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

    const handleSocketMessage = async (message) => {
      console.log("RECEIVED SOCKET MESSAGE:", message);

      // ignore messages from other chats
      if (String(message.chat._id) !== String(chatId)) return;

      // ignore messages sent by itself (already added via REST)
      if (String(message.sender._id) === String(user._id)) return;

      setMessages((prev) => [...prev, message]);

      // tells backend - message is delivered
      await markAsDelivered(message._id);

      setLoading(false);
      // tells Chat.jsx "I have a new message"
      onNewMessage(chatId, message.content);
    };

    socket.on("new-message", handleSocketMessage);

    return () => {
      socket.off("new-message", handleSocketMessage);
    };
  }, [chatId, user._id]);

  // sender listens for delivery update
  useEffect(() => {
    const handleDelivered = (updatedMessage) => {
      if (String(updatedMessage.chat._id) !== String(chatId)) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? { ...msg, delivered: true } : msg,
        ),
      );
    };
    socket.on("message-delivered", handleDelivered);
    return () => socket.off("message-delivered", handleDelivered);
  }, [chatId]);

  // When messages load and chat is open then this useEffect will work
  // when user open chat -> mark message as seen
  useEffect(() => {
    if (!chatId) return;

    // user open this chat -> mark message as seen
    markSeen(chatId);
  }, [chatId]);

  // Sender listens for seen update
  useEffect(() => {
    const handleSeen = ({ chatId: seenChatId }) => {
      if (String(seenChatId) !== String(chatId)) return;

      setMessages((prev) =>
        prev.map((msg) =>
          String(msg.sender._id) === String(user._id)
            ? { ...msg, seen: true }
            : msg,
        ),
      );
    };

    socket.on("messages-seen", handleSeen);
    return () => socket.off("messages-seen", handleSeen);
  }, [chatId, socket, user._id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 overflow-y-auto flex-col m-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            text={msg.content}
            time={new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isOwn={String(msg.sender._id) === String(user._id)}
            delivered={msg.delivered}
            seen={msg.seen}
          />
        ))}

        <div className="flex items-center">
          {showTyping && (
            <TypeAnimation
              sequence={[".", 300, "..", 300, "...", 600, "", 200]}
              speed={99}
              repeat={Infinity}
              className="ml-2 text-sm text-gray-300 font-medium tracking-widest select-none"
            />
          )}
        </div>

        {/* taking message input */}
        <div ref={bottomRef}></div>
      </div>
      <ChatInput onSend={handleSendMessage} socket={socket} chatId={chatId} />
    </>
  );
};

export default MessageList;
