import React from "react";

const MessageBubble = ({ text, time, isOwn, delivered, seen }) => {
  let status = "✓";

  if (seen) {
    status = "👀"; 
  } else if (delivered) {
    status = "✓✓";
  }

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

      <div className="flex justify-end items-center gap-1 mt-1">
        <p className="text-[10px] opacity-60">{time}</p>

        {isOwn && <span key={status} className="text-[10px] opacity-70 tick-animate">{status}</span>}
      </div>
    </div>
  );
};

export default MessageBubble;
