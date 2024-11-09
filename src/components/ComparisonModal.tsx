import React from 'react';
import { X } from 'lucide-react';

interface Requirement {
  id: number;
  text: string;
}

interface Product {
  id: number;
  title: string;
  url: string;
  overview: string;
}

interface RequirementMatch {
  productId: number;
  requirementId: number;
  match: string;
}

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  requirements: Requirement[];
  requirementMatches: RequirementMatch[];
}

export default function ComparisonModal({ isOpen, onClose, products, requirements, requirementMatches }: ComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Product Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-50 border border-gray-200 min-w-[200px]">Requirements</th>
                {products.map((product) => (
                  <th key={product.id} className="text-left p-3 bg-gray-50 border border-gray-200 min-w-[250px]">
                    <div>
                      <a 
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        {product.title}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">{product.overview}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id}>
                  <td className="p-3 border border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-800">{req.text}</span>
                  </td>
                  {products.map((product) => {
                    const match = requirementMatches.find(
                      rm => rm.productId === product.id && rm.requirementId === req.id
                    );
                    return (
                      <td key={product.id} className="p-3 border border-gray-200">
                        <div className="text-sm text-gray-600">
                          {match?.match || 'Not specified'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}