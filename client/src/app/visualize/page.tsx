import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import DocumentVisualizer from '@/components/DocumentVisualizer';

export const metadata: Metadata = {
  title: 'Visualize | The Professor',
  description: 'Visualize your document as an interactive topic map with AI-powered analysis.',
};

export default function VisualizePage() {
  return (
    <main className="container-page">
      <div className="wrapper">
        <div className="text-center mb-8">
          <p className="label-text mb-2">✦ Document Intelligence</p>
          <h1 className="page-title mb-3">Visual Breakdown</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            See your document&apos;s topics, connections, and key insights at a glance
          </p>
        </div>
        <Suspense fallback={<div className="text-center p-10">Generating visualization...</div>}>
          <DocumentVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
