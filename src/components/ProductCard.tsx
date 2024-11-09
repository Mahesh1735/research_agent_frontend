import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  url: string;
  overview: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Generate the favicon URL based on the product URL
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(product.url).hostname}&sz=128`;

  return (
    <div 
      className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all bg-white"
      onMouseEnter={() => setIsExpanded(true)} // Expand on mouse enter
      onMouseLeave={() => setIsExpanded(false)} // Collapse on mouse leave
    >
      <div className="flex gap-3">
        <div className="flex items-center">
          <a 
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <img 
              src={faviconUrl}
              alt="Site icon"
              className="w-20 h-20 rounded" // Increased size for better visibility
            />
          </a>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">
            {product.title}
          </h3>
          <a 
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-2"
          >
            <span className="truncate">{new URL(product.url).hostname}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
          <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>
            {product.overview} // Show overview text, clamped to 3 lines when not expanded
          </p>
        </div>
      </div>
    </div>
  );
}