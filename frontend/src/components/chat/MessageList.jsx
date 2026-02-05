import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import {
  getMessages,
  sendMessage,
  sendFileMessage,
  markSeen,
} from "../../api/message.api";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../../context/AuthContext";
import ChatInput from "./ChatInput";
import socket from "../../socket";
import ImageModal from "./ImageModal";
import VideoModal from "./VideoModal";

const MessageList = ({ chatId, onNewMessage }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [previewImage, setImagePreview] = useState(null);
  const [previewVideo, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // IMPORTANT: delivered should NOT come from REST
        const normalized = data.map((msg) => ({
          ...msg,
          delivered:
            String(msg.sender._id) === String(user._id) ? false : msg.delivered,
        }));

        setMessages(normalized);
      } catch (error) {
        console.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    markSeen(chatId);
  }, [chatId, user._id]);

  useEffect(() => {
    const handleTyping = ({ chatId: typingChatId, username }) => {
      if (String(typingChatId) === String(chatId)) {
        setShowTyping(true);
        setTypingUser(username);
      }
    };

    const handleStopTyping = ({ chatId: typingChatId }) => {
      if (String(typingChatId) === String(chatId)) {
        setShowTyping(false);
        setTypingUser(null);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [chatId]);

  useEffect(() => {
    const handleAITypingStart = ({ chatId: typingChatId }) => {
      if (String(typingChatId) === String(chatId)) {
        setIsAITyping(true);
      }
    };

    const handleAITypingStop = ({ chatId: typingChatId }) => {
      if (String(typingChatId) === String(chatId)) {
        setIsAITyping(false);
      }
    };

    socket.on("ai-typing-start", handleAITypingStart);
    socket.on("ai-typing-stop", handleAITypingStop);

    return () => {
      socket.off("ai-typing-start", handleAITypingStart);
      socket.off("ai-typing-stop", handleAITypingStop);
    };
  }, [chatId]);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, showTyping, isAITyping]);

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

  const handleSendFile = async (file) => {
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("file", file);

    try {
      const newMessage = await sendFileMessage(formData);

      setMessages((prev) => [
        ...prev,
        { ...newMessage, delivered: false, seen: false },
      ]);

      onNewMessage(chatId, "📎 File");
    } catch (error) {
      console.error("File send failed");
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
      if (String(message.chat._id) !== String(chatId)) return;
      if (String(message.sender._id) === String(user._id)) return;

      setMessages((prev) => [...prev, message]);

      socket.emit("message-delivered", {
        messageId: message._id,
        chatId,
      });

      markSeen(chatId);
      onNewMessage(chatId, message.content);
    };

    socket.on("new-message", handleSocketMessage);
    return () => socket.off("new-message", handleSocketMessage);
  }, [chatId, user._id]);

  useEffect(() => {
    const handleSeen = ({ chatId: seenChatId }) => {
      if (String(seenChatId) !== String(chatId)) return;

      setMessages((prev) =>
        prev.map((msg) =>
          String(msg.sender._id) === String(user._id)
            ? { ...msg, seen: true, delivered: true }
            : msg,
        ),
      );
    };

    socket.on("messages-seen", handleSeen);
    return () => socket.off("messages-seen", handleSeen);
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
      <div className="flex flex-1 overflow-y-auto flex-col m-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            time={new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isOwn={String(msg.sender._id) === String(user._id)}
            delivered={msg.delivered}
            seen={msg.seen}
            onImageClick={setImagePreview}
            onVideoClick={setVideoPreview}
          />
        ))}

        {showTyping && typingUser && (
          <div className="flex items-center ml-2 text-sm text-gray-300">
            <span className="mr-1">{typingUser}</span>
            <TypeAnimation
              sequence={[".", 300, "..", 300, "...", 600, "", 200]}
              speed={99}
              repeat={Infinity}
              className="tracking-widest select-none"
            />
          </div>
        )}

        {isAITyping && (
          <div className="ml-2 text-sm text-gray-300 italic">
            HeyAI is typing
            <TypeAnimation
              sequence={[".", 300, "..", 300, "...", 600, "", 200]}
              speed={99}
              repeat={Infinity}
              className="inline-block ml-1 tracking-widest select-none"
            />
          </div>
        )}

        {/* taking message input */}
        <div ref={bottomRef}></div>
      </div>

      <ChatInput
        onSend={handleSendMessage}
        onSendFile={handleSendFile}
        socket={socket}
        chatId={chatId}
      />

      {previewImage && (
        <ImageModal
          imageUrl={previewImage}
          onClose={() => setImagePreview(null)}
        />
      )}

      {previewVideo && (
        <VideoModal
          videoUrl={previewVideo}
          onClose={() => setVideoPreview(null)}
        />
      )}
    </>
  );
};

export default MessageList;
