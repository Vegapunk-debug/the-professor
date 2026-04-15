'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  Zap,
  Loader2,
  Upload,
  Sparkles,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 'What architectural pattern does The Professor use to separate concerns?',
    options: ['Microservices', 'Model-View-Controller (MVC)', 'Event-Driven Architecture', 'Monolithic'],
    correct: 1,
    explanation: 'The Professor follows the MVC pattern: Models define data, Views render the UI, and Controllers manage logic flow.',
  },
  {
    id: 2,
    question: 'Which AI model powers the contextual chat feature?',
    options: ['GPT-4', 'Claude 3', 'Gemini 2.0 Flash', 'LLaMA 3'],
    correct: 2,
    explanation: 'The Professor integrates with Google Gemini 2.0 Flash for real-time, document-grounded AI conversations.',
  },
];

type QuizState = 'intro' | 'loading' | 'playing' | 'result' | 'error';

export default function QuizPanel() {
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
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

  const question = questions[currentQ];
  const totalQ = questions.length;
  const progressPct = useMemo(
    () => ((currentQ + (answered ? 1 : 0)) / totalQ) * 100,
    [currentQ, answered, totalQ]
  );

  const generateQuiz = async () => {
    const storedText = localStorage.getItem('prof_doc_text');
    if (!storedText) return;

    setQuizState('loading');
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5001/api/quiz', {
        text: storedText,
      });

      const generated = res.data.questions;
      if (Array.isArray(generated) && generated.length > 0) {
        setQuestions(generated.map((q: Question, i: number) => ({ ...q, id: i + 1 })));
        setQuizState('playing');
      } else {
        throw new Error('Empty quiz response');
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Failed to generate quiz. Please try again.';
      setErrorMsg(msg);
      setQuizState('error');
    }
  };

  const startWithSample = () => {
    setQuestions(sampleQuestions);
    setQuizState('playing');
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setAnswers((prev) => [...prev, idx]);
    if (idx === question.correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ < totalQ - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setQuizState('result');
    }
  };

  const restart = () => {
    setQuizState('intro');
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setAnswers([]);
  };

  const getScoreMessage = () => {
    const pct = (score / totalQ) * 100;
    if (pct === 100) return { emoji: '🏆', text: 'Perfect Score! Outstanding!' };
    if (pct >= 80) return { emoji: '🎉', text: 'Excellent work!' };
    if (pct >= 60) return { emoji: '👍', text: 'Good job! Keep learning.' };
    return { emoji: '📚', text: 'Review the material and try again!' };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {quizState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="icon-circle bg-primary/20 !w-16 !h-16 mx-auto mb-6">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-black mb-3">Knowledge Assessment</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Test your understanding with AI-generated questions.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-8">
              <span className="tag tag-mint">
                <Zap size={10} />
                5 Questions
              </span>
              <span className="tag tag-yellow">
                <Trophy size={10} />
                Multiple Choice
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {hasDocument ? (
                <>
                  <button
                    onClick={generateQuiz}
                    className="btn-primary text-base px-7 py-3 w-full justify-center"
                    id="generate-quiz-btn"
                  >
                    <Sparkles size={16} />
                    Generate from &ldquo;{docName.length > 25 ? docName.substring(0, 25) + '...' : docName}&rdquo;
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={startWithSample}
                    className="btn-secondary text-sm px-7 py-2.5 w-full justify-center"
                    id="sample-quiz-btn"
                  >
                    Or try sample quiz
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startWithSample}
                    className="btn-primary text-base px-7 py-3 w-full justify-center"
                    id="start-quiz-btn"
                  >
                    Start Sample Quiz
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
                    <Upload size={10} />
                    <Link href="/upload" className="underline font-bold hover:text-foreground transition-colors">
                      Upload a PDF
                    </Link>
                    to generate custom quizzes
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {quizState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="icon-circle bg-primary/20 !w-16 !h-16 mx-auto mb-6">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <h3 className="text-xl font-black mb-2">Generating Quiz...</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI is analyzing your document and creating questions
            </p>
          </motion.div>
        )}

        {quizState === 'playing' && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="bento-card-static !p-6 sm:!p-8"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="label-text">
                Question {currentQ + 1} / {totalQ}
              </span>
              <span className="tag tag-yellow text-[10px]">
                Score: {score}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 mb-6 border-2 border-foreground overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ ease: 'easeOut' as const, duration: 0.4 }}
              />
            </div>

            <h3 className="text-lg font-black mb-6 leading-relaxed">
              {question.question}
            </h3>

            <div className="space-y-2.5 mb-5">
              {question.options.map((opt, idx) => {
                let cls =
                  'border-2 border-foreground bg-card hover:bg-primary/15 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--foreground)] cursor-pointer';

                if (answered) {
                  if (idx === question.correct) {
                    cls = 'border-2 border-foreground bg-[var(--bg-mint)] cursor-default';
                  } else if (idx === selected && idx !== question.correct) {
                    cls = 'border-2 border-foreground bg-[var(--bg-pink)] cursor-default';
                  } else {
                    cls = 'border-2 border-foreground bg-card opacity-40 cursor-default';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${cls}`}
                  >
                    <span className="w-7 h-7 rounded-lg border-2 border-foreground bg-muted flex items-center justify-center text-xs font-black shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {answered && idx === question.correct && (
                      <CheckCircle size={16} className="text-green-800 shrink-0" />
                    )}
                    {answered && idx === selected && idx !== question.correct && (
                      <XCircle size={16} className="text-red-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`bento-card-static !p-4 mb-4 text-sm ${
                      selected === question.correct
                        ? '!bg-[var(--bg-mint)]/30'
                        : '!bg-[var(--bg-peach)]/50'
                    }`}
                  >
                    <p className="font-black mb-1">
                      {selected === question.correct ? '✅ Correct!' : '❌ Not quite.'}
                    </p>
                    <p className="text-muted-foreground">{question.explanation}</p>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="btn-primary w-full justify-center"
                    id="next-question-btn"
                  >
                    {currentQ < totalQ - 1 ? (
                      <>Next Question <ArrowRight size={14} /></>
                    ) : (
                      <>View Results <Trophy size={14} /></>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {quizState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bento-card-static !p-8 sm:!p-12 text-center"
          >
            <div className="text-5xl mb-4">{getScoreMessage().emoji}</div>
            <h3 className="text-2xl font-black mb-2">Quiz Complete!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {getScoreMessage().text}
            </p>

            <div className="inline-flex items-center gap-2 text-4xl font-black mb-8">
              <span className="text-primary">{score}</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-muted-foreground">{totalQ}</span>
            </div>

            <button
              onClick={restart}
              className="btn-primary text-base px-7 py-3"
              id="restart-quiz-btn"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
