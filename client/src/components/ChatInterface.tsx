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
  const [docContext, setDocContext] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedText = localStorage.getItem('prof_doc_text');
    const storedName = localStorage.getItem('prof_doc_name');

    if (storedText && storedText.trim().length > 0) {
      setDocContext(storedText);
      setDocName(storedName || 'Uploaded Document');
      setMessages([
        {
          id: '1',
          text: `**Document loaded: ${storedName || 'Uploaded Document'}**\n\nI've read your document! Ask me anything about its contents — I'll answer based on the document context.`,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: '1',
          text: "Hey! I'm **The Professor** \n\nAsk me anything — upload a PDF first for context-aware answers, or just chat freely!",
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const clearDocContext = () => {
    localStorage.removeItem('prof_doc_text');
    localStorage.removeItem('prof_doc_name');
    localStorage.removeItem('prof_doc_summary');
    setDocContext(null);
    setDocName(null);
    setMessages([
      {
        id: Date.now().toString(),
        text: "Document context cleared! I'm now in free chat mode ",
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto px-4 sm:px-5">
      <div className="bento-card-static !p-0 flex flex-col flex-1 overflow-hidden">
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

        {/* Document context banner */}
        {docContext && (
          <div className="flex items-center justify-between px-5 py-2 bg-[var(--bg-mint)]/30 border-b-2 border-foreground">
            <div className="flex items-center gap-2 text-xs font-bold">
              <FileText size={12} />
              <span>Context: {docName}</span>
            </div>
            <button
              onClick={clearDocContext}
              className="p-1 rounded-lg hover:bg-[var(--bg-pink)]/50 transition-all"
              title="Remove document context"
              id="clear-context-btn"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* No document hint */}
        {!docContext && messages.length <= 1 && (
          <div className="flex items-center justify-center px-5 py-2 bg-muted/50 border-b-2 border-foreground">
            <p className="text-[10px] text-muted-foreground">
               <Link href="/upload" className="underline font-bold hover:text-foreground transition-colors">Upload a PDF</Link> first for document-grounded answers
            </p>
          </div>
        )}

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
                  {msg.sender === 'ai' ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2 prose-pre:bg-muted prose-pre:border-2 prose-pre:border-foreground prose-pre:rounded-xl prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-foreground/20">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
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

        <div className="px-5 py-4 border-t-2 border-foreground bg-card">
          <form onSubmit={(e) => e.preventDefault()} className="flex items-end gap-2.5">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              className="flex-1 resize-none border-2 border-foreground rounded-xl px-4 py-3 text-sm bg-background placeholder:text-muted-foreground focus:outline-none transition-all"
              placeholder="Type a message..."
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