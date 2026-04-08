import type { Metadata } from 'next';
import QuizPanel from '@/components/QuizPanel';

export const metadata: Metadata = {
  title: 'Quiz | The Professor',
  description: 'Test your knowledge with AI-generated quizzes.',
};

export default function QuizPage() {
  return (
    <main className="container-page">
      <div className="wrapper">
        <div className="text-center mb-8">
          <p className="label-text mb-2">✦ Self-Assessment</p>
          <h1 className="page-title mb-3">Knowledge Quiz</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Test your understanding with auto-generated MCQs
          </p>
        </div>
        <QuizPanel />
      </div>
    </main>
  );
}
