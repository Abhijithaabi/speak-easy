"use client";

/**
 * @file components/ChatBox.tsx
 * @description Renders the conversation history between the user and the persona.
 */

import React, { useEffect, useRef } from "react";

/**
 * @typedef {Object} Message
 * @property {"user" | "model"} role - The sender of the message.
 * @property {string} content - The text content of the message.
 */
export interface Message {
  role: "user" | "model";
  content: string;
}

/**
 * @typedef {Object} ChatBoxProps
 * @property {Message[]} messages - Array of message objects to display.
 */
interface ChatBoxProps {
  messages: Message[];
}

/**
 * ChatBox Component
 * @param {ChatBoxProps} props - The component props.
 * @returns {JSX.Element} The rendered chat interface.
 */
export default function ChatBox({ messages }: ChatBoxProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom whenever a new message is added
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-md border border-gray-200 mb-4 h-96">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">Start the negotiation...</p>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-300 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}