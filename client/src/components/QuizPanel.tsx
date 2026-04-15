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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bento-card-static !p-8 sm:!p-12 text-center">
        <h3 className="text-2xl font-black mb-3">Knowledge Assessment</h3>
        <p className="text-sm text-muted-foreground mb-8">
          Initial setup for the Quiz Panel.
        </p>
      </div>
    </div>
  );
}
