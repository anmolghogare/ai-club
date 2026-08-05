import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../../lib/api';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'What events did the club host?',
  'Who convens the club?',
  'Who are the club members?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hey there! 👋 I'm NeuralNode, AI Club DAU's assistant. Ask me anything about the club, events, projects, or our members!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsLoading(true);
    try {
      const apiUrl = getApiUrl('/api/club-chat');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Sorry, I couldn't reach the server right now. Please try again in a moment!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-[360px] rounded-2xl bg-card border border-border flex flex-col overflow-hidden"
            style={{ boxShadow: '0 25px 60px -15px hsl(217 91% 60% / 0.25), 0 0 0 1px hsl(217 91% 60% / 0.08)' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                <Bot size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-display font-bold text-sm text-foreground">NeuralNode</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  <span className="text-[10px] text-muted-foreground">AI Club DAU Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[240px] max-h-[340px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={12} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-secondary text-foreground rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={12} className="text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Loader2 size={12} className="text-primary animate-spin" />
                  </div>
                  <div className="bg-secondary rounded-xl rounded-tl-sm px-4 py-2.5">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((j) => (
                        <span
                          key={j}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
                          style={{ animation: `pulse-dot 1.2s ease-in-out ${j * 0.2}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested questions */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 mt-2"
                >
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Sparkles size={10} />
                    Suggested
                  </p>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left text-xs px-3 py-2 rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-secondary transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2 bg-card">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about AI Club..."
                disabled={isLoading}
                className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60 disabled:opacity-50"
              />
              <motion.button
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full btn-glow flex items-center justify-center text-primary-foreground transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? {} : { boxShadow: ['0 4px 15px hsl(217 91% 60% / 0.35)', '0 4px 28px hsl(217 91% 60% / 0.6)', '0 4px 15px hsl(217 91% 60% / 0.35)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
