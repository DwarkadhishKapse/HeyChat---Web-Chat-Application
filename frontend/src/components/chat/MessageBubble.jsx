import React from "react";
import ReactMarkdown from "react-markdown";

const MessageBubble = ({
  message,
  time,
  isOwn,
  delivered,
  seen,
  onImageClick,
  onVideoClick,
}) => {
  const { messageType, content, fileUrl, fileName, fileSize } = message;

  const mediaUrl = message.fileUrl;

  let status = "✓";
  if (seen) status = "👀";
  else if (delivered) status = "✓✓";

  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm mb-2 mr-3
        ${
          isOwn
            ? "ml-auto bg-green-600 text-white rounded-br-none"
            : "mr-auto bg-[#1f1f1f] text-white rounded-bl-none"
        }`}
    >
      {/* TEXT MESSAGE */}
      {messageType === "text" && (
        <div className="prose prose-invert max-w-none text-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}

      {/* IMAGE MESSAGE */}
      {messageType === "image" && (
        <img
          src={mediaUrl}
          alt="image"
          onClick={() => onImageClick(mediaUrl)}
          className="rounded-lg max-h-60 cursor-pointer hover:opacity-90"
        />
      )}

      {/* VIDEO MESSAGE */}
      {messageType === "video" && (
        <video
          src={mediaUrl}
          controls
          onClick={() => onVideoClick(mediaUrl)}
          className="rounded-lg max-h-60 cursor-pointer"
        />
      )}

      {/* FILE MESSAGE */}
      {messageType === "file" && (
        <a
          href={mediaUrl}
          download
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-black/20 p-2 rounded-lg"
        >
          <span className="text-xl">📎</span>
          <div className="max-w-45">
            <p className="text-sm truncate">{fileName}</p>
            <p className="text-[10px] opacity-60">
              {(fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </a>
      )}

      {/* TIME + STATUS */}
      <div className="flex justify-end items-center gap-1 mt-1">
        <p className="text-[10px] opacity-60">{time}</p>
        {isOwn && (
          <span className="text-[10px] opacity-70 tick-animate">{status}</span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
