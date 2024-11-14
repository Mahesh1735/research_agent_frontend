import React, { useState, useEffect, useRef } from 'react';
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
    { id: 1, text: "Hi!\n\nI'm Hanu, your AI consultant.\n\nTell me what products, tools, or software you are looking for, and I'll find the best options across the internet tailored to your requirements!", sender: "assistant" },
  ]);
  const [inputText, setInputText] = useState("");

  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: 1, text: "Start chatting for collecting your requirements." },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "Hanu.ai",
      url: "https://askhanu.com/",
      overview: "Get your tasks done with the first AI Agent Marketplace",
    },
  ]);

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    // "What's ",
    // "Do they come ",
    // "What's",
    // "Do they ",
    // "What's the ",
    // "Do they come ",
    // "What's",
    // "Do they ",
    // "What's the ",
    // "What's the ",
    // "Do they come ",
    // "What's",
    // "Do they ",
    // "What's the ",
    // "Do they come with warranty coverage dfasddfafdfdfsd?",
    // "What's the battery life of these laptops?",
    // "Do they come with warranty coverage?",
    // "What's the battery life of these laptops?",
    // "Do they come with warranty coverage?",
  ]);

  const [requirementMatches, setRequirementMatches] = useState<RequirementMatch[]>([]);

  const [threadId] = useState(() => uuidv4());

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [countdownInterval, setCountdownInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setCountdown(120); // Reset countdown to 120 seconds
    
    // Start countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0; // Keep at 0 instead of resetting to 120
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);

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
    } finally {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      setCountdown(120);
      setIsLoading(false); // Only set loading to false after API response
      setInputText("");
    }
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

  const handleSuggestionClick = (text: string) => {
    // Append text to input field with a space
    setInputText(prev => prev ? `${prev} ${text}` : text);
    
    // Remove the clicked suggestion from the list
    setSuggestedQuestions(prev => prev.filter(q => q !== text));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Requirements Panel */}
      <div className="w-[20%] bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-6">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Your Requirements:</h2>
        </div>
        <Requirements items={requirements} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatContainerRef}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-8">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
              <h2 className="text-4xl font-semibold text-gray-800">Hanu.ai</h2>
            </div>
            {messages.map((message, index) => (
              <ChatBubble 
                key={message.id} 
                message={message} 
                isFirstMessage={index === 0}
              />
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-white relative">
          <div className="max-w-4xl mx-auto">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-indigo-600 font-medium">
                    Processing... {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-4 max-h-[85px] overflow-y-hidden">
              {suggestedQuestions.map((question, index) => (
                <SuggestedQuestion 
                  key={index} 
                  text={question} 
                  onClick={handleSuggestionClick}
                  disabled={isLoading}
                />
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                style={{ 
                  minHeight: '40px',
                  maxHeight: '120px',
                  lineHeight: '24px',
                  height: 'auto',
                  resize: 'none',
                  overflowY: 'auto',
                  padding: '8px 16px'
                }}
                className={`flex-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '40px';
                  const newHeight = Math.min(target.scrollHeight, 120);
                  target.style.height = `${newHeight}px`;
                }}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg transition-colors h-fit ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Products Panel */}
      <div className="w-[25%] bg-white border-l border-gray-200 flex flex-col">
        {/* Products List Section */}
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-6">
              <Package className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">Recommended Products</h2>
            </div>
            <div className="space-y-2 overflow-y-auto h-[calc(100vh-280px)]">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Export Section - Fixed at bottom */}
        <div className="border-t border-gray-200 h-[180px] flex items-center p-4 bg-white">
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