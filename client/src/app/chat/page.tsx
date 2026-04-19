import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ChatInterface from '@/components/ChatInterface';

export const metadata: Metadata = {
  title: 'AI Chat | The Professor',
  description: 'Chat with The Professor AI about your documents.',
};

export default function ChatPage() {
  return (
    <main className="pt-24 pb-6">
      <Suspense fallback={<div className="container-page text-center p-20">Loading chat...</div>}>
        <ChatInterface />
      </Suspense>
    </main>
  );
}
