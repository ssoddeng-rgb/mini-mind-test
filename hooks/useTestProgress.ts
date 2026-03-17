'use client';
import { useState, useCallback } from 'react';
import type { Test, TestSession, UserAnswer, QuizPhase } from '@/types/test';
import { computeResult } from '@/lib/scoring/engine';

export function useTestProgress(test: Test) {
  const [session, setSession] = useState<TestSession>({
    testId: test.meta.id,
    phase: 'intro',
    currentQuestionIndex: 0,
    answers: [],
    startedAt: Date.now(),
  });

  const start = useCallback(() => {
    setSession(prev => ({ ...prev, phase: 'question', startedAt: Date.now() }));
  }, []);

  const answer = useCallback((optionId: string, scores: Record<string, number>, timeRemaining: number) => {
    setSession(prev => {
      const question = test.questions[prev.currentQuestionIndex];
      const newAnswer: UserAnswer = {
        questionId: question.id,
        optionId,
        scores,
        timeRemaining,
      };
      const newAnswers = [...prev.answers, newAnswer];
      const isLast = prev.currentQuestionIndex === test.questions.length - 1;

      if (isLast) {
        const resultTypeId = computeResult(test, newAnswers);
        return {
          ...prev,
          answers: newAnswers,
          phase: 'computing' as QuizPhase,
          resultTypeId,
          completedAt: Date.now(),
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      };
    });
  }, [test]);

  const timeUp = useCallback(() => {
    setSession(prev => {
      const question = test.questions[prev.currentQuestionIndex];
      // Auto-select first option on timeout
      const firstOption = question.options[0];
      const newAnswer: UserAnswer = {
        questionId: question.id,
        optionId: firstOption.id,
        scores: firstOption.scores,
        timeRemaining: 0,
      };
      const newAnswers = [...prev.answers, newAnswer];
      const isLast = prev.currentQuestionIndex === test.questions.length - 1;

      if (isLast) {
        const resultTypeId = computeResult(test, newAnswers);
        return {
          ...prev,
          answers: newAnswers,
          phase: 'computing' as QuizPhase,
          resultTypeId,
          completedAt: Date.now(),
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      };
    });
  }, [test]);

  const reset = useCallback(() => {
    setSession({
      testId: test.meta.id,
      phase: 'intro',
      currentQuestionIndex: 0,
      answers: [],
      startedAt: Date.now(),
    });
  }, [test]);

  return { session, start, answer, timeUp, reset };
}
