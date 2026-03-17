'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getTest } from '@/lib/tests';
import { useTestProgress } from '@/hooks/useTestProgress';
import { useQuestionTimer } from '@/hooks/useQuestionTimer';
import QuestionCard from '@/components/test/QuestionCard';
import QuestionTimer from '@/components/test/QuestionTimer';
import ProgressBar from '@/components/test/ProgressBar';

const QUESTION_DURATION = 30;

export default function QuizClient() {
  const params = useParams();
  const testId = params.testId as string;

  let test;
  try {
    test = getTest(testId);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">테스트를 찾을 수 없습니다.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 underline">돌아가기</Link>
        </div>
      </div>
    );
  }

  return <QuizContent test={test} testId={testId} />;
}

function QuizContent({ test, testId }: { test: ReturnType<typeof getTest>; testId: string }) {
  const router = useRouter();
  const { session, start, answer, timeUp } = useTestProgress(test);

  // Tracks which option is visually selected (before advancing)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const answerLockRef = useRef(false);

  // Incrementing this key restarts the timer for each new question
  const [timerResetKey, setTimerResetKey] = useState(0);

  const currentQuestion = test.questions[session.currentQuestionIndex];

  const { timeRemaining, isWarning } = useQuestionTimer(
    QUESTION_DURATION,
    () => {
      if (session.phase === 'question' && !answerLockRef.current) {
        answerLockRef.current = true;
        timeUp();
        setTimeout(() => {
          answerLockRef.current = false;
          setSelectedOptionId(null);
          setTimerResetKey(k => k + 1);
        }, 400);
      }
    },
    session.phase === 'question',
    timerResetKey,
  );

  // Redirect when computing done
  useEffect(() => {
    if (session.phase === 'computing' && session.resultTypeId) {
      const timer = setTimeout(() => {
        router.push(`/tests/${testId}/results/${session.resultTypeId}`);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [session.phase, session.resultTypeId, testId, router]);

  // Auto-start on mount
  useEffect(() => {
    start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (optionId: string, scores: Record<string, number>) => {
    if (answerLockRef.current || session.phase !== 'question') return;

    answerLockRef.current = true;
    setSelectedOptionId(optionId);

    // Brief visual feedback before advancing
    setTimeout(() => {
      answer(optionId, scores, timeRemaining);
      answerLockRef.current = false;
      setSelectedOptionId(null);
      setTimerResetKey(k => k + 1);
    }, 450);
  };

  if (session.phase === 'computing') {
    return <ComputingScreen test={test} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className={`absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br ${test.meta.gradient} opacity-[0.08] blur-[120px]`} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/tests/${testId}`}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg px-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">{test.meta.titleKo}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50" aria-hidden="true">{test.meta.emoji}</span>
            <QuestionTimer
              timeRemaining={timeRemaining}
              duration={QUESTION_DURATION}
              isWarning={isWarning}
            />
          </div>
        </div>

        <div className="mb-8">
          <ProgressBar
            current={session.currentQuestionIndex + 1}
            total={test.questions.length}
            gradient={test.meta.gradient}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {currentQuestion && session.phase === 'question' && (
            <QuestionCard
              question={currentQuestion}
              questionNumber={session.currentQuestionIndex + 1}
              totalQuestions={test.questions.length}
              onAnswer={handleAnswer}
              selectedOptionId={selectedOptionId ?? undefined}
              gradient={test.meta.gradient}
            />
          )}
        </div>

        <AnimatePresence>
          {isWarning && session.phase === 'question' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 text-center text-orange-400 text-sm font-medium"
              role="alert"
              aria-live="polite"
            >
              ⏰ 시간이 얼마 남지 않았어요!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ComputingScreen({ test }: { test: ReturnType<typeof getTest> }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl mb-6"
          role="img"
          aria-label="분석 중"
        >
          {test.meta.emoji}
        </motion.div>

        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${test.meta.gradient} opacity-20 animate-ping`} />
          <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${test.meta.gradient} opacity-40`} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-white mb-2"
        >
          결과 분석 중...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-white/40"
        >
          당신의 답변을 바탕으로 유형을 분석하고 있어요
        </motion.p>
      </div>
    </div>
  );
}
