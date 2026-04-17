'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import {
  Network,
  Loader2,
  Upload,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  BookOpen,
  Link2,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface Topic {
  name: string;
  summary: string;
  keyPoints: string[];
  importance: 'high' | 'medium' | 'low';
}

interface Connection {
  from: string;
  to: string;
  relation: string;
}

interface VisualizationData {
  title: string;
  topics: Topic[];
  connections: Connection[];
}

type VisState = 'intro' | 'loading' | 'display' | 'error';

const importanceColors: Record<string, { bg: string; tag: string }> = {
  high: { bg: 'var(--bg-yellow)', tag: 'tag-yellow' },
  medium: { bg: 'var(--bg-mint)', tag: 'tag-mint' },
  low: { bg: 'var(--bg-purple)', tag: 'tag-purple' },
};

export default function DocumentVisualizer() {
  const [visState, setVisState] = useState<VisState>('intro');
  const [data, setData] = useState<VisualizationData | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [hasDocument, setHasDocument] = useState(false);
  const [docName, setDocName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);

  useEffect(() => {
    const storedText = localStorage.getItem('prof_doc_text');
    const storedName = localStorage.getItem('prof_doc_name');
    if (storedText && storedText.trim().length > 0) {
      setHasDocument(true);
      setDocName(storedName || 'Uploaded Document');
    }
  }, []);

  const generateVisualization = useCallback(async () => {
    const storedText = localStorage.getItem('prof_doc_text');
    if (!storedText) return;

    const cached = localStorage.getItem('prof_viz_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.title && Array.isArray(parsed.topics)) {
          setData(parsed);
          localStorage.removeItem('prof_viz_cache'); // Use cache once
          setVisState('display');
          return;
        }
      } catch { /* fall through to API call */ }
    }

    setVisState('loading');
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5001/api/visualize', {
        text: storedText,
      });

      const viz = res.data.visualization;
      if (viz && viz.title && Array.isArray(viz.topics)) {
        setData(viz);
        setVisState('display');
      } else {
        throw new Error('Invalid visualization response');
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Failed to generate visualization. Please try again.';
      setErrorMsg(msg);
      setVisState('error');
    }
  }, []);

  const toggleTopic = (idx: number) => {
export default function DocumentVisualizer() { return <div></div>; }
