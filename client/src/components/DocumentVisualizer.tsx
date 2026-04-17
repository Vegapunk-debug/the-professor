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
export default function DocumentVisualizer() { return <div></div>; }
