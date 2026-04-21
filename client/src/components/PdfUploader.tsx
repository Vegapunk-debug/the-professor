'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  ArrowRight,
  MessageSquareText,
  BrainCircuit,
  Network,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/config/api';

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

interface UploadResult {
  filename: string;
  summary: string;
  extractedText: string;
  documentId?: string;
  questions?: Array<{ id: number; question: string; options: string[]; correct: number; explanation: string }>;
  flashcards?: Array<{ id: number; front: string; back: string; category: string }>;
  visualization?: { title: string; topics: Array<unknown>; connections: Array<unknown> };
}

export default function PdfUploader() {
  const [state, setState] = useState<UploadState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getAuthHeader } = useAuth();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('dragging');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('idle');
  }, []);

  const validateFile = (f: File): string | null => {
    if (f.type !== 'application/pdf') return 'Only PDF files are accepted.';
    if (f.size > 20 * 1024 * 1024) return 'File must be smaller than 20MB.';
    return null;
  };

  const uploadFile = async (f: File) => {
    setState('uploading');
    setProgress(0);
    setFile(f);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', f);

    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeader() },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      setResult(res.data);
      
      localStorage.setItem('prof_doc_text', res.data.extractedText);
      localStorage.setItem('prof_doc_name', res.data.filename);
      localStorage.setItem('prof_doc_summary', res.data.summary);
      if (res.data.documentId) {
        localStorage.setItem('prof_doc_id', res.data.documentId);
      }
      
      setState('success');
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Upload failed. Make sure the server is running on port 5001.';
      setError(msg);
      setState('error');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setState('error');
      return;
    }
    uploadFile(f);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setState('error');
      return;
    }
    uploadFile(f);
  };

  const reset = () => {
    setState('idle');
    setFile(null);
    setResult(null);
    setError('');
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {(state === 'idle' || state === 'dragging') && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`bento-card-static cursor-pointer !p-10 sm:!p-14 text-center transition-all duration-200 ${
              state === 'dragging'
                ? 'bg-primary/20 border-primary !border-[3px] scale-[1.01]'
                : 'hover:shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-1'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload-input"
            />

            <motion.div
              animate={
                state === 'dragging'
                  ? { scale: 1.15, rotate: 5 }
                  : { scale: 1, rotate: 0 }
              }
              className="mx-auto icon-circle !w-16 !h-16 bg-primary/20 mb-6"
            >
              <Upload size={24} />
            </motion.div>

            <h3 className="text-xl font-black mb-2">
              {state === 'dragging' ? 'Drop it here!' : 'Drag & drop your PDF'}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              or click to browse from your computer
            </p>
            <span className="tag tag-purple text-[10px]">PDF · Max 20MB</span>
          </motion.div>
        )}
  
        {state === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-10 text-center"
          >
            <div className="mx-auto icon-circle !w-16 !h-16 bg-primary/20 mb-6">
              <Loader2 size={24} className="animate-spin" />
            </div>

            <h3 className="text-xl font-black mb-1">Processing...</h3>
            <p className="text-sm text-muted-foreground mb-6">{file?.name}</p>

            <div className="w-full bg-muted rounded-full h-3 mb-2 border-2 border-foreground overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' as const }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{progress}%</p>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles size={12} />
              Gemini 2.0 Flash is analyzing your document
            </div>
          </motion.div>
        )}

        {state === 'success' && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-6 sm:!p-8"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="icon-circle bg-[var(--bg-mint)]">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black">Analysis Complete</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <FileText size={12} />
                    {result.filename}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="p-2 rounded-xl border-2 border-foreground bg-card hover:bg-primary transition-all"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="bento-card-static !bg-muted/50 !p-4 mb-5">
              <p className="label-text mb-2 flex items-center gap-1.5">
                <Sparkles size={10} /> AI Summary
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <Link
                href={`/chat${result.documentId ? `?doc=${result.documentId}` : ''}`}
                className="btn-primary justify-center text-xs"
                id="start-chat-success-btn"
              >
                <MessageSquareText size={14} />
                Start Chatting
              </Link>
              <Link
                href={`/visualize${result.documentId ? `?doc=${result.documentId}` : ''}`}
                className="btn-secondary justify-center text-xs !bg-[var(--bg-blue)]"
                id="visualize-success-btn"
              >
                <Network size={14} />
                Visualize
              </Link>
              <Link
                href={`/quiz${result.documentId ? `?doc=${result.documentId}` : ''}`}
                className="btn-secondary justify-center text-xs !bg-[var(--bg-mint)]"
                id="gen-quiz-success-btn"
              >
                <BrainCircuit size={14} />
                Generate Quiz
              </Link>
              <Link
                href={`/flashcards${result.documentId ? `?doc=${result.documentId}` : ''}`}
                className="btn-secondary justify-center text-xs !bg-[var(--bg-peach)]"
                id="flashcards-success-btn"
              >
                <Layers size={14} />
                Flashcards
              </Link>
            </div>

            <button
              onClick={reset}
              className="w-full py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2 border-2 border-dashed border-foreground/10 rounded-xl hover:border-foreground/30"
            >
              <ArrowRight size={14} />
              Upload Another Document
            </button>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-10 text-center"
          >
            <div className="mx-auto icon-circle !w-14 !h-14 bg-[var(--bg-pink)] mb-5">
              <AlertCircle size={22} />
            </div>
            <h3 className="text-xl font-black mb-2">Upload Failed</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <button onClick={reset} className="btn-primary">
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
