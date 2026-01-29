import React from "react";

const MessageBubble = ({ text, time, isOwn, delivered, seen }) => {
  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm mb-2
        ${
          isOwn
            ? "ml-auto bg-green-600 text-white rounded-br-none"
            : "mr-auto bg-[#1f1f1f] text-white rounded-bl-none"
        }`}
    >
      <p>{text}</p>
      <p className="text-[10px] text-right opacity-60 mt-1">{time}</p>
      {isOwn && (
        <span className="text-[10px] text-right opacity-70">
          {delivered ? "✓" : seen ? "✓✓" : "✓"}
        </span>
      )}
    </div>
  );
};

export default MessageBubble;
