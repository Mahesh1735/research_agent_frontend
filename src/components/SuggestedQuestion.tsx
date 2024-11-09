import React from 'react';
import { MessageCircle } from 'lucide-react';

interface SuggestedQuestionProps {
  text: string;
}

export default function SuggestedQuestion({ text }: SuggestedQuestionProps) {
  return (
    <button className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
      <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
      <span className="text-sm text-gray-600 group-hover:text-indigo-600">{text}</span>
    </button>
  );
}