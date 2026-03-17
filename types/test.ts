export type TestCategory = 'self' | 'romance' | 'friendship';

export interface TestMeta {
  id: string;
  slug: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  category: TestCategory;
  questionCount: number;
  estimatedMinutes: number;
  academicSource: string;
  gradient: string;
  emoji: string;
}

export type ScoringMethod = 'mbti-dichotomy' | 'accumulation' | 'scale' | 'weighted-multi';

export interface AnswerOption {
  id: string;
  text: string;
  textKo: string;
  scores: Record<string, number>;
}

export interface Question {
  id: string;
  text: string;
  textKo: string;
  options: AnswerOption[];
}

export interface ResultType {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  traits: string[];
  traitsKo: string[];
  strengthsKo?: string[];
  weaknessesKo?: string[];
  careerFitsKo?: string[];
  relationshipTipKo?: string;
  compatibleWith?: string[];
  compatibleDescriptionKo?: string;
  emoji: string;
  gradient: string;
}

export interface ScoringConfig {
  method: ScoringMethod;
  axes?: string[];
  dimensions?: string[];
  profiles?: Array<{ id: string; conditions: Record<string, string> }>;
}

export interface Test {
  meta: TestMeta;
  scoring: ScoringConfig;
  questions: Question[];
  results: ResultType[];
}

export interface UserAnswer {
  questionId: string;
  optionId: string;
  scores: Record<string, number>;
  timeRemaining: number;
}

export type QuizPhase = 'intro' | 'question' | 'computing' | 'done';

export interface TestSession {
  testId: string;
  phase: QuizPhase;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  resultTypeId?: string;
  startedAt: number;
  completedAt?: number;
}
