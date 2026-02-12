import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWindowContent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'m HogBot. Ask me anything about Alex\'s work! 🦔' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
       const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
       }));

       const responseText = await sendMessageToGemini(userMsg, history);
       
       setMessages(prev => [...prev, { role: 'model', text: responseText || "Sorry, I'm out of tokens right now." }]);
    } catch (err) {
       console.error(err);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-ph-bg">
      {/* Terminal Header */}
      <div className="bg-black text-green-400 p-2 font-mono text-xs flex justify-between items-center">
         <span>root@hogbot:~# ./run_ai.sh</span>
         <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ONLINE</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 bg-ph-orange border-2 border-black flex items-center justify-center mr-2 shrink-0 shadow-retro">
                    <Bot size={16} className="text-black" />
                </div>
            )}
            <div 
              className={`max-w-[80%] p-3 text-sm font-bold border-2 border-black shadow-retro 
                ${msg.role === 'user' ? 'bg-white text-black' : 'bg-white text-black'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-ph-yellow text-black p-2 border-2 border-black shadow-retro flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> 
                <span className="text-xs font-bold">Processing...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t-2 border-black flex gap-2">
        <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask HogBot..."
              className="w-full h-full bg-ph-bg border-2 border-black px-3 py-2 text-sm outline-none font-bold placeholder:text-gray-400 focus:bg-white transition-colors shadow-inner"
            />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-ph-orange border-2 border-black px-4 hover:bg-black hover:text-white disabled:opacity-50 transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindowContent;