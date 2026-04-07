'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Sparkles, Trash2, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm **The Professor** 🧪\n\nAsk me anything — upload a PDF first for context-aware answers, or just chat freely!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/chat', { prompt: userText });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: res.data.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: '⚠️ Could not connect to the server. Make sure the backend is running on port 5001.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Chat cleared! Ready for a fresh conversation 🧹",
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto px-4 sm:px-5">
      {/* Chat container — bordered card */}
      <div className="bento-card-static !p-0 flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
          <div className="flex items-center gap-3">
            <div className="icon-circle bg-primary/20 !w-9 !h-9">
              <Bot size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black">The Professor AI</h2>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Gemini 2.0 Flash · Online
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-xl border-2 border-foreground bg-card hover:bg-[var(--bg-pink)] transition-all"
            title="Clear chat"
            id="clear-chat-btn"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="icon-circle bg-primary/15 !w-7 !h-7 shrink-0 mt-1 !border-[1.5px]">
                    <Sparkles size={12} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed border-2 border-foreground ${
                    msg.sender === 'user'
                      ? 'bg-primary rounded-br-md'
                      : 'bg-card rounded-bl-md'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2 prose-pre:bg-muted prose-pre:border-2 prose-pre:border-foreground prose-pre:rounded-xl prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-foreground/20">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <p className="text-[10px] mt-1.5 opacity-40">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {msg.sender === 'user' && (
                  <div className="icon-circle bg-[var(--bg-peach)] !w-7 !h-7 shrink-0 mt-1 !border-[1.5px]">
                    <span className="text-xs font-black">U</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="icon-circle bg-primary/15 !w-7 !h-7 !border-[1.5px]">
                <Sparkles size={12} />
              </div>
              <div className="bg-card border-2 border-foreground px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs text-muted-foreground font-bold">
                    Thinking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t-2 border-foreground bg-card">
          <form onSubmit={sendMessage} className="flex items-end gap-2.5">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 resize-none border-2 border-foreground rounded-xl px-4 py-3 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Type a message... (Shift+Enter for new line)"
              disabled={loading}
              id="chat-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary !px-4 !py-3 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              id="chat-send-btn"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}