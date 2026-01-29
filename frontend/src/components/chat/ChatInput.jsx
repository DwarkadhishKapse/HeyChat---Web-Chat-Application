import React, { useState } from "react";
import { useRef } from "react";

const ChatInput = ({ onSend, chatId, socket }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // emit "typing" only once
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      socket.emit("typing", { chatId });
    }

    // debounce stop typing
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId });
      setIsTyping(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");

    // stop typing immediately
    socket.emit("stopTyping", { chatId });
    setIsTyping(false);
    clearTimeout(typingTimeoutRef.current);
  };

  return (
    <div className="h-16 px-4 flex items-center gap-3 border-t border-gray-800 bg-[#0f0f0f]">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 px-4 py-2 rounded-full bg-[#1a1a1a] text-sm outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
