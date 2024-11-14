import React from 'react';
import { MessageCircle } from 'lucide-react';

interface SuggestedQuestionProps {
  text: string;
  onClick: (text: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestion({ text, onClick, disabled }: SuggestedQuestionProps) {
  return (
    <button 
      onClick={() => onClick(text)}
      disabled={disabled}
      className={`group flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 transition-colors whitespace-nowrap flex-shrink-0 ${
        disabled 
          ? 'cursor-not-allowed opacity-50' 
          : 'hover:border-indigo-300 hover:bg-indigo-50'
      }`}
    >
      <MessageCircle className={`w-4 h-4 ${
        disabled 
          ? 'text-gray-400' 
          : 'text-gray-400 group-hover:text-indigo-500'
      } flex-shrink-0`} />
      <span className={`text-sm ${
        disabled 
          ? 'text-gray-400' 
          : 'text-gray-600 group-hover:text-indigo-600'
      } truncate`}>
        {text}
      </span>
    </button>
  );
}