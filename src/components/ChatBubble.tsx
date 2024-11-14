import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
}

interface ChatBubbleProps {
  message: Message;
  isFirstMessage?: boolean;
}

export default function ChatBubble({ message, isFirstMessage = false }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gray-100 text-gray-800'
            : 'bg-indigo-600 text-white'
        }`}
      >
        <ReactMarkdown className={`${isFirstMessage ? 'text-lg' : 'text-sm'}`}>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}