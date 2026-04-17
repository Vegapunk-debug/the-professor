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
    setExpandedTopic(expandedTopic === idx ? null : idx);
  };

  const getTopicIndex = (name: string): number => {
    if (!data) return -1;
    return data.topics.findIndex((t) => t.name === name);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {visState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="icon-circle bg-[var(--bg-blue)] !w-16 !h-16 mx-auto mb-6">
              <Network size={28} />
            </div>
            <h3 className="text-2xl font-black mb-3">Document Visualizer</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Break down your document into an interactive topic map.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-8">
              <span className="tag tag-blue">
                <Eye size={10} />
                Visual Map
              </span>
              <span className="tag tag-mint">
                <Zap size={10} />
                AI-Powered
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {hasDocument ? (
                <button
                  onClick={generateVisualization}
                  className="btn-primary text-base px-7 py-3 w-full justify-center"
                  id="generate-viz-btn"
                >
                  <Sparkles size={16} />
                  Visualize &ldquo;{docName.length > 25 ? docName.substring(0, 25) + '...' : docName}&rdquo;
                  <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <div className="bento-card-static !bg-muted/50 !p-6 mb-2">
                    <Upload size={24} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No document uploaded yet.
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <Upload size={10} />
                    <Link href="/upload" className="underline font-bold hover:text-foreground transition-colors">
                      Upload a PDF
                    </Link>
                    to generate a visual breakdown
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {visState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="icon-circle bg-[var(--bg-blue)] !w-16 !h-16 mx-auto mb-6">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <h3 className="text-xl font-black mb-2">Analyzing Document...</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI is breaking down your document into topics and connections
            </p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {visState === 'error' && (
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
            <h3 className="text-xl font-black mb-2">Visualization Failed</h3>
            <p className="text-sm text-muted-foreground mb-6">{errorMsg}</p>
            <button onClick={generateVisualization} className="btn-primary">
              Try Again
            </button>
          </motion.div>
        )}

        {visState === 'display' && data && (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="bento-card-static !p-5 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-circle bg-[var(--bg-blue)]">
                  <Network size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black">{data.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {data.topics.length} topics · {data.connections?.length || 0} connections
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setVisState('intro');
                  setData(null);
                  setExpandedTopic(null);
                }}
                className="p-2 rounded-xl border-2 border-foreground bg-card hover:bg-primary transition-all"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* Topic Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {data.topics.map((topic, idx) => {
                const colors = importanceColors[topic.importance] || importanceColors.medium;
                const isExpanded = expandedTopic === idx;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bento-card cursor-pointer"
                    style={{ borderLeftWidth: '4px', borderLeftColor: colors.bg }}
                    onClick={() => toggleTopic(idx)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="icon-circle !w-8 !h-8 shrink-0"
                          style={{ background: colors.bg }}
                        >
                          <span className="text-xs font-black">{idx + 1}</span>
                        </div>
                        <h4 className="font-black text-sm truncate">{topic.name}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`tag ${colors.tag} text-[9px] !px-2 !py-0.5`}>
                          {topic.importance}
                        </span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {topic.summary}
                    </p>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 border-t-2 border-foreground/10 mt-1">
                            <p className="label-text mb-2 flex items-center gap-1">
                              <BookOpen size={10} />
                              Key Points
                            </p>
                            <ul className="space-y-1.5">
                              {topic.keyPoints.map((point, pidx) => (
                                <motion.li
                                  key={pidx}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: pidx * 0.05 }}
                                  className="flex items-start gap-2 text-xs"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                    style={{ background: colors.bg }}
                                  />
                                  {point}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Connections */}
            {data.connections && data.connections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bento-card-static !p-5"
              >
                <p className="label-text mb-3 flex items-center gap-1.5">
                  <Link2 size={10} />
                  Topic Connections
                </p>
                <div className="space-y-2">
                  {data.connections.map((conn, cidx) => {
                    const fromIdx = getTopicIndex(conn.from);
                    const toIdx = getTopicIndex(conn.to);
                    const isHovered = hoveredConnection === cidx;

                    return (
                      <motion.div
                        key={cidx}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + cidx * 0.06 }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-foreground/10 transition-all cursor-default text-xs ${
                          isHovered ? 'bg-primary/10 border-foreground/30' : 'bg-muted/30'
                        }`}
                        onMouseEnter={() => setHoveredConnection(cidx)}
                        onMouseLeave={() => setHoveredConnection(null)}
                      >
                        <span
                          className="tag text-[9px] !px-2 !py-0.5"
                          style={{
                            background:
                              fromIdx >= 0
                                ? importanceColors[data.topics[fromIdx].importance]?.bg
                                : 'var(--muted)',
                          }}
                        >
                          {conn.from}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                          <div className="w-4 h-[2px] bg-foreground/20 rounded" />
                          <span className="text-[10px] font-bold italic">{conn.relation}</span>
                          <div className="w-4 h-[2px] bg-foreground/20 rounded" />
                          <ArrowRight size={10} />
                        </div>
                        <span
                          className="tag text-[9px] !px-2 !py-0.5"
                          style={{
                            background:
                              toIdx >= 0
                                ? importanceColors[data.topics[toIdx].importance]?.bg
                                : 'var(--muted)',
                          }}
                        >
                          {conn.to}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
