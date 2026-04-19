import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import FlashcardPanel from '@/components/FlashcardPanel';

export const metadata: Metadata = {
  title: 'Flashcards | The Professor',
  description: 'Study with AI-generated flashcards for active recall and self-assessment.',
};

export default function FlashcardsPage() {
  return (
    <main className="container-page">
      <div className="wrapper">
        <div className="text-center mb-8">
          <p className="label-text mb-2">✦ Active Recall</p>
          <h1 className="page-title mb-3">Flashcards</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Master key concepts with interactive flip cards
          </p>
        </div>
        <Suspense fallback={<div className="text-center p-10">Loading study session...</div>}>
          <FlashcardPanel />
        </Suspense>
      </div>
    </main>
  );
}
