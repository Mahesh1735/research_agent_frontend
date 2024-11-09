import React from 'react';

interface Requirement {
  id: number;
  text: string;
}

interface RequirementsProps {
  items: Requirement[];
}

export default function Requirements({ items }: RequirementsProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gray-400" />
          <span className="text-sm text-gray-800">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}