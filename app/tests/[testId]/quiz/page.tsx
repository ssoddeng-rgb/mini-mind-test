import { getAllTests } from '@/lib/tests';
import QuizClient from './QuizClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  const tests = getAllTests();
  return tests.map(t => ({ testId: t.id }));
}

export default function QuizPage() {
  return <QuizClient />;
}
