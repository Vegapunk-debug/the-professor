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

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto px-4 sm:px-5">
      <div className="bento-card-static !p-0 flex flex-col flex-1 overflow-hidden">
        {/* Placeholder for now */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <p className="text-sm text-muted-foreground">Initializing Chat...</p>
        </div>
      </div>
    </div>
  );
}