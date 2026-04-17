'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import {
  Layers,
  Loader2,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Shuffle,
  CheckCircle,
  RefreshCw,
  Trophy,
  Zap,
  AlertCircle,
  MousePointerClick,
} from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

type FlashState = 'intro' | 'loading' | 'playing' | 'result' | 'error';

export default function FlashcardPanel() {
  const [flashState, setFlashState] = useState<FlashState>('intro');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [reviewing, setReviewing] = useState<Set<number>>(new Set());
  const [hasDocument, setHasDocument] = useState(false);
  const [docName, setDocName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedText = localStorage.getItem('prof_doc_text');
    const storedName = localStorage.getItem('prof_doc_name');
    if (storedText && storedText.trim().length > 0) {
      setHasDocument(true);
      setDocName(storedName || 'Uploaded Document');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flashState !== 'playing') return;
      if (e.key === 'ArrowLeft') prevCard();
      if (e.key === 'ArrowRight') nextCard();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flashState, currentIdx, cards.length]);

  const generateFlashcards = useCallback(async () => {
    const storedText = localStorage.getItem('prof_doc_text');
    if (!storedText) return;

    // Check for pre-cached flashcards from parallel upload processing
    const cached = localStorage.getItem('prof_flashcard_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed.map((c: Flashcard, i: number) => ({ ...c, id: i + 1 })));
          setCurrentIdx(0);
          setIsFlipped(false);
          setMastered(new Set());
          setReviewing(new Set());
          localStorage.removeItem('prof_flashcard_cache'); // Use cache once
          setFlashState('playing');
          return;
        }
      } catch { /* fall through to API call */ }
    }

    setFlashState('loading');
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5001/api/flashcards', {
        text: storedText,
      });

      const generated = res.data.flashcards;
      if (Array.isArray(generated) && generated.length > 0) {
        setCards(generated.map((c: Flashcard, i: number) => ({ ...c, id: i + 1 })));
        setCurrentIdx(0);
        setIsFlipped(false);
        setMastered(new Set());
        setReviewing(new Set());
        setFlashState('playing');
      } else {
        throw new Error('Empty flashcard response');
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Failed to generate flashcards. Please try again.';
      setErrorMsg(msg);
      setFlashState('error');
    }
  }, []);

  const nextCard = () => {
    if (currentIdx < cards.length - 1) {
      setCurrentIdx((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      setIsFlipped(false);
    }
  };

  const markMastered = () => {
    setMastered((prev) => {
      const next = new Set(prev);
      next.add(currentIdx);
      return next;
    });
    setReviewing((prev) => {
      const next = new Set(prev);
      next.delete(currentIdx);
      return next;
    });
    if (currentIdx < cards.length - 1) {
      nextCard();
    } else {
      setFlashState('result');
    }
  };

  const markReview = () => {
    setReviewing((prev) => {
      const next = new Set(prev);
      next.add(currentIdx);
      return next;
    });
    setMastered((prev) => {
      const next = new Set(prev);
      next.delete(currentIdx);
      return next;
    });
    if (currentIdx < cards.length - 1) {
      nextCard();
    } else {
      setFlashState('result');
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIdx(0);
    setIsFlipped(false);
    setMastered(new Set());
    setReviewing(new Set());
  };

  const restart = () => {
    setFlashState('intro');
    setCards([]);
    setCurrentIdx(0);
    setIsFlipped(false);
    setMastered(new Set());
    setReviewing(new Set());
  };

  const finishReview = () => {
    setFlashState('result');
  };

  const card = cards[currentIdx];
  const progressPct = cards.length > 0 ? ((currentIdx + 1) / cards.length) * 100 : 0;

  const categoryColors: Record<string, string> = {};
  const colorPool = ['tag-yellow', 'tag-mint', 'tag-pink', 'tag-purple', 'tag-peach', 'tag-blue'];
  cards.forEach((c) => {
    if (!categoryColors[c.category]) {
      categoryColors[c.category] = colorPool[Object.keys(categoryColors).length % colorPool.length];
    }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {flashState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="icon-circle bg-[var(--bg-peach)] !w-16 !h-16 mx-auto mb-6">
              <Layers size={28} />
            </div>
            <h3 className="text-2xl font-black mb-3">Flashcards</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Master key concepts with interactive flip cards.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-8">
              <span className="tag tag-peach">
                <Zap size={10} />
                10 Cards
              </span>
              <span className="tag tag-mint">
                <MousePointerClick size={10} />
                Tap to Flip
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {hasDocument ? (
                <button
                  onClick={generateFlashcards}
                  className="btn-primary text-base px-7 py-3 w-full justify-center"
                  id="generate-flashcards-btn"
                >
                  <Sparkles size={16} />
                  Generate from &ldquo;{docName.length > 25 ? docName.substring(0, 25) + '...' : docName}&rdquo;
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
                    to generate flashcards
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {flashState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="icon-circle bg-[var(--bg-peach)] !w-16 !h-16 mx-auto mb-6">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <h3 className="text-xl font-black mb-2">Creating Flashcards...</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI is extracting key concepts from your document
            </p>
          </motion.div>
        )}

        {flashState === 'error' && (
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
            <h3 className="text-xl font-black mb-2">Generation Failed</h3>
            <p className="text-sm text-muted-foreground mb-6">{errorMsg}</p>
            <button onClick={generateFlashcards} className="btn-primary">
              Try Again
            </button>
          </motion.div>
        )}

        {flashState === 'playing' && card && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress header */}
            <div className="flex items-center justify-between mb-3">
              <span className="label-text">
                Card {currentIdx + 1} / {cards.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="tag tag-mint text-[10px]">
                  <CheckCircle size={10} />
                  {mastered.size} mastered
                </span>
                <span className="tag tag-pink text-[10px]">
                  <RefreshCw size={10} />
                  {reviewing.size} review
                </span>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2.5 mb-5 border-2 border-foreground overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
              />
            </div>

            {/* Flashcard */}
            <div
              className="perspective-[1200px] mb-5 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="relative w-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div
                  className="bento-card-static !p-8 sm:!p-10 min-h-[260px] flex flex-col items-center justify-center text-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className={`tag ${categoryColors[card.category] || 'tag-purple'} text-[10px] mb-4`}>
                    {card.category}
                  </span>
                  <p className="text-lg sm:text-xl font-black leading-relaxed">{card.front}</p>
                  <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
                    <MousePointerClick size={12} />
                    Tap to reveal answer
                  </p>
                </div>

                {/* Back */}
                <div
                  className="bento-card-static !p-8 sm:!p-10 min-h-[260px] flex flex-col items-center justify-center text-center absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'var(--bg-mint)',
                  }}
                >
                  <span className={`tag ${categoryColors[card.category] || 'tag-purple'} text-[10px] mb-4 !bg-card`}>
                    {card.category}
                  </span>
                  <p className="text-base sm:text-lg font-bold leading-relaxed">{card.back}</p>
                </div>
              </motion.div>
            </div>

            {/* Rating buttons (visible after flip) */}
            <AnimatePresence>
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="grid grid-cols-2 gap-3 mb-4"
                >
                  <button
                    onClick={markMastered}
                    className="btn-secondary !bg-[var(--bg-mint)] justify-center text-sm py-3"
                    id="mark-mastered-btn"
                  >
                    <CheckCircle size={16} />
                    Got it ✅
                  </button>
                  <button
                    onClick={markReview}
                    className="btn-secondary !bg-[var(--bg-pink)] justify-center text-sm py-3"
                    id="mark-review-btn"
                  >
                    <RefreshCw size={16} />
                    Review again 🔄
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevCard}
                disabled={currentIdx === 0}
                className="btn-secondary !px-4 !py-2.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                id="prev-card-btn"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={shuffleCards}
                  className="p-2.5 rounded-xl border-2 border-foreground bg-card hover:bg-primary transition-all"
                  title="Shuffle cards"
                  id="shuffle-cards-btn"
                >
                  <Shuffle size={14} />
                </button>
                <button
                  onClick={finishReview}
                  className="p-2.5 rounded-xl border-2 border-foreground bg-card hover:bg-[var(--bg-yellow)] transition-all"
                  title="Finish & see results"
                  id="finish-review-btn"
                >
                  <Trophy size={14} />
                </button>
              </div>

              <button
                onClick={nextCard}
                disabled={currentIdx === cards.length - 1}
                className="btn-secondary !px-4 !py-2.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                id="next-card-btn"
              >
                Next
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIdx(i);
                    setIsFlipped(false);
                  }}
                  className={`w-2.5 h-2.5 rounded-full border border-foreground transition-all ${
                    i === currentIdx
                      ? 'bg-primary scale-125'
                      : mastered.has(i)
                      ? 'bg-[var(--bg-mint)]'
                      : reviewing.has(i)
                      ? 'bg-[var(--bg-pink)]'
                      : 'bg-muted'
                  }`}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {flashState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="text-5xl mb-4">
              {mastered.size === cards.length
                ? '🏆'
                : mastered.size >= cards.length * 0.7
                ? '🎉'
                : '📚'}
            </div>
            <h3 className="text-2xl font-black mb-2">Review Complete!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {mastered.size === cards.length
                ? 'Perfect! You mastered every card!'
                : mastered.size >= cards.length * 0.7
                ? 'Great job! Keep practicing the remaining cards.'
                : 'Keep studying — practice makes perfect!'}
            </p>

            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-black text-[var(--bg-mint)]">{mastered.size}</div>
                <p className="text-xs text-muted-foreground font-bold mt-1">Mastered</p>
              </div>
              <div className="w-px bg-foreground/10" />
              <div className="text-center">
                <div className="text-3xl font-black text-[var(--bg-pink)]">{reviewing.size}</div>
                <p className="text-xs text-muted-foreground font-bold mt-1">Need Review</p>
              </div>
              <div className="w-px bg-foreground/10" />
              <div className="text-center">
                <div className="text-3xl font-black text-muted-foreground">
                  {cards.length - mastered.size - reviewing.size}
                </div>
                <p className="text-xs text-muted-foreground font-bold mt-1">Unseen</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setIsFlipped(false);
                  setFlashState('playing');
                }}
                className="btn-primary text-base px-7 py-3"
                id="review-again-btn"
              >
                <RotateCcw size={16} />
                Review Again
              </button>
              <button onClick={restart} className="btn-secondary text-base px-7 py-3">
                <Sparkles size={16} />
                New Flashcards
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
