'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Send, Loader2, Sparkles, Trash2, Bot, FileText, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: "Hey! I'm **The Professor** \n\nAsk me anything — upload a PDF first for context-aware answers, or just chat freely!",
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto px-4 sm:px-5">
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
                Professor · Online
              </p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="icon-circle bg-primary/15 !w-7 !h-7 shrink-0 mt-1 !border-[1.5px]">
                    <Sparkles size={12} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed border-2 border-foreground ${msg.sender === 'user'
                      ? 'bg-primary rounded-br-md'
                      : 'bg-card rounded-bl-md'
                    }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {msg.sender === 'user' && (
                  <div className="icon-circle bg-[var(--bg-peach)] !w-7 !h-7 shrink-0 mt-1 !border-[1.5px]">
                    <span className="text-xs font-black">U</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}