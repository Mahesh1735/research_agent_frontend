import React, { useState } from 'react';
import { MessageSquare, CheckSquare, Package, Download } from 'lucide-react';
import Requirements from './components/Requirements';
import ChatBubble from './components/ChatBubble';
import ProductCard from './components/ProductCard';
import SuggestedQuestion from './components/SuggestedQuestion';
import ComparisonModal from './components/ComparisonModal';
import { v4 as uuidv4 } from 'uuid';

type Message = {
  id: number;
  text: string;
  sender: "user" | "assistant";
};

type Requirement = {
  id: number;
  text: string;
};

type Product = {
  id: number;
  title: string;
  url: string;
  overview: string;
};

type ApiResponse = {
  requirements: Requirement[] | null;
  candidates: Product[] | null;
  last_ai_message: string;
};

type RequirementMatch = {
  productId: number;
  requirementId: number;
  match: string;
};

// Add these type definitions to match the API response format
type ApiCandidate = {
  title: string;
  overview: string;
  product_URL: string;
  raw_content: string | null;
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "I need a laptop for video editing", sender: "user" },
    { id: 2, text: "I recommend checking these high-performance laptops that are perfect for video editing.", sender: "assistant" },
  ]);
  const [inputText, setInputText] = useState("");

  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: 1, text: "16GB RAM minimum" },
    { id: 2, text: "Dedicated GPU" },
    { id: 3, text: "i7 or better processor" },
    { id: 4, text: "4K display" },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "ProBook Studio",
      url: "https://askhanu.com/",
      overview: "High-performance laptop with 32GB RAM, RTX 4070, i9-13900H processor perfect for video editing and creative work.",
    },
    {
      id: 2,
      title: "CreatorBook Pro",
      url: "https://www.producthunt.com/",
      overview: "Premium creator laptop featuring 64GB RAM, RTX 4080, i9-13950HX processor with Mini LED display.",
    },
  ]);

  const suggestedQuestions = [
    "What's the battery life of these laptops?",
    "Do they come with warranty coverage?",
  ];

  const [requirementMatches, setRequirementMatches] = useState<RequirementMatch[]>([]);

  const [threadId] = useState(() => uuidv4());

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user"
    };
    setMessages([...messages, newUserMessage]);

    try {
      console.log('Sending request to:', import.meta.env.VITE_AGENT_API_URL);
      
      const response = await fetch(`${import.meta.env.VITE_AGENT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          query: inputText
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData}`);
      }

      const data: ApiResponse = await response.json();
      console.log('API Response:', data);

      if (data.last_ai_message) {
        const newAiMessage: Message = {
          id: messages.length + 2,
          text: data.last_ai_message,
          sender: "assistant"
        };
        setMessages(prev => [...prev, newAiMessage]);
      }

      // Process requirements
      if (data.requirements && Array.isArray(data.requirements)) {
        const processedRequirements: Requirement[] = data.requirements.map((req, index) => ({
          id: index + 1,
          text: typeof req === 'string' ? req : req.text
        }));
        setRequirements(processedRequirements);
      }

      // Process candidates
      if (data.candidates && Array.isArray(data.candidates)) {
        const processedProducts: Product[] = (data.candidates as unknown as ApiCandidate[]).map((candidate, index) => ({
          id: index + 1,
          title: candidate.title || 'Untitled Product',
          url: candidate.product_URL || '#',
          overview: candidate.overview || 'No description available'
        }));
        setProducts(processedProducts);
      }

    } catch (error) {
      console.error('Detailed error:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        sender: "assistant"
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInputText("");
  };

  const handleCompareClick = () => {
    // Here you would typically make an API call to get the requirement matches
    // For now, we'll just set some sample data
    setRequirementMatches([
      { productId: 1, requirementId: 1, match: "32GB RAM (Exceeds)" },
      { productId: 1, requirementId: 2, match: "RTX 4070 (Dedicated)" },
      { productId: 1, requirementId: 3, match: "i9-13900H (Exceeds)" },
      { productId: 1, requirementId: 4, match: "4K OLED Display" },
      { productId: 2, requirementId: 1, match: "64GB RAM (Exceeds)" },
      { productId: 2, requirementId: 2, match: "RTX 4080 (Dedicated)" },
      { productId: 2, requirementId: 3, match: "i9-13950HX (Exceeds)" },
      { productId: 2, requirementId: 4, match: "4K Mini LED Display" },
    ]);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Requirements Panel */}
      <div className="w-96 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-6">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Requirements</h2>
        </div>
        <Requirements items={requirements} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-8">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">Chat Assistant</h2>
            </div>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3 mb-4">
              {suggestedQuestions.map((question, index) => (
                <SuggestedQuestion key={index} text={question} />
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Products Panel */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Recommended</h2>
          </div>
          <div className="space-y-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        {/* Export Section */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button 
            onClick={handleCompareClick}
            className="w-full bg-indigo-600 text-white p-8 rounded-lg hover:bg-indigo-700 transition-colors flex flex-col items-center justify-center space-y-2"
          >
            <Download className="w-8 h-8" />
            <span className="text-lg font-semibold">Compare Products</span>
            <span className="text-sm text-indigo-200">View detailed comparison</span>
          </button>
        </div>
      </div>

      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        requirements={requirements}
        requirementMatches={requirementMatches}
      />
    </div>
  );
}

export default App;