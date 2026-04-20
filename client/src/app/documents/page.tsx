'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import { 
  FileText, 
  MessageSquareText, 
  BrainCircuit, 
  Layers, 
  Network, 
  Calendar, 
  ArrowRight,
  Loader2,
  Inbox,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/config/api';

interface Document {
  _id: string;
  file_name: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeader, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/documents`, {
        headers: getAuthHeader()
      });
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <main className="container-page">
        <div className="wrapper text-center">
          <div className="icon-circle bg-primary/20 !w-16 !h-16 mx-auto mb-6">
            <Inbox size={28} />
          </div>
          <h1 className="page-title mb-4">My Documents</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Please sign in to view your saved documents and learning progress.
          </p>
          <Link href="/sign-in" className="btn-primary">
            Sign In →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page">
      <div className="wrapper">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="label-text mb-2 text-primary flex items-center gap-2">
              <Sparkles size={14} /> Your Document Library
            </p>
            <h1 className="page-title">My Documents</h1>
          </div>
          <Link href="/upload" className="btn-primary text-sm flex items-center gap-2">
            Upload New <FileText size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-bold italic">Loading your library...</p>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, idx) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bento-card group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="icon-circle bg-primary/10 !w-10 !h-10">
                    <FileText size={20} />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-black mb-1 truncate group-hover:text-primary transition-colors" title={doc.file_name}>
                  {doc.file_name}
                </h3>
                
                <div className="flex-1"></div>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <Link 
                    href={`/chat?doc=${doc._id}`}
                    className="p-2 border-2 border-foreground rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-all text-xs font-bold"
                  >
                    <MessageSquareText size={14} /> Chat
                  </Link>
                  <Link 
                    href={`/quiz?doc=${doc._id}`}
                    className="p-2 border-2 border-foreground rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--bg-mint)] transition-all text-xs font-bold"
                  >
                    <BrainCircuit size={14} /> Quiz
                  </Link>
                  <Link 
                    href={`/flashcards?doc=${doc._id}`}
                    className="p-2 border-2 border-foreground rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--bg-peach)] transition-all text-xs font-bold"
                  >
                    <Layers size={14} /> Cards
                  </Link>
                  <Link 
                    href={`/visualize?doc=${doc._id}`}
                    className="p-2 border-2 border-foreground rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--bg-blue)] transition-all text-xs font-bold"
                  >
                    <Network size={14} /> Viz
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bento-card-static !p-12 text-center max-w-xl mx-auto">
            <div className="icon-circle bg-muted !w-16 !h-16 mx-auto mb-6">
              <Inbox size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-black mb-2">No Documents Yet</h3>
            <p className="text-sm text-muted-foreground mb-8">
              Your library is empty! Upload your first PDF to start learning with The Professor.
            </p>
            <Link href="/upload" className="btn-primary">
              Upload First Document <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
