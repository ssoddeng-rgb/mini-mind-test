'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question, AnswerOption } from '@/types/test';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionId: string, scores: Record<string, number>) => void;
  selectedOptionId?: string;
  gradient: string;
}

export default function QuestionCard({
  question,
  questionNumber,
  onAnswer,
  selectedOptionId,
  gradient,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {/* Question number chip */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br ${gradient} text-xs font-bold text-white shadow-md`}>
            {questionNumber}
          </span>
          <span className="text-xs text-white/40 font-medium">번 질문</span>
        </div>

        {/* Question text */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-1">
            {question.textKo}
          </h2>
          <p className="text-sm text-white/30 leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-3" role="group" aria-label="답변 선택">
          {question.options.map((option, idx) => (
            <OptionButton
              key={option.id}
              option={option}
              index={idx}
              isSelected={selectedOptionId === option.id}
              gradient={gradient}
              onSelect={() => onAnswer(option.id, option.scores)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface OptionButtonProps {
  option: AnswerOption;
  index: number;
  isSelected: boolean;
  gradient: string;
  onSelect: () => void;
}

function OptionButton({ option, index, isSelected, gradient, onSelect }: OptionButtonProps) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];
  const label = optionLabels[index] ?? String(index + 1);

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      onClick={onSelect}
      disabled={!!isSelected}
      aria-label={option.textKo}
      className={`group relative w-full text-left rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
        isSelected
          ? `bg-gradient-to-r ${gradient} bg-opacity-100 border-transparent shadow-xl scale-[1.02]`
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.99]'
      }`}
    >
      {/* Hover glow effect */}
      {!isSelected && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
      )}

      <div className="relative flex items-center gap-3 px-4 py-3.5">
        {/* Option letter badge */}
        <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
          isSelected
            ? 'bg-white/20 text-white'
            : 'bg-white/10 text-white/50 group-hover:bg-white/15 group-hover:text-white/70'
        }`}>
          {label}
        </span>

        {/* Option text */}
        <div>
          <p className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
            isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
          }`}>
            {option.textKo}
          </p>
          {option.text && option.text !== option.textKo && (
            <p className={`text-xs mt-0.5 transition-colors duration-200 ${
              isSelected ? 'text-white/70' : 'text-white/30'
            }`}>
              {option.text}
            </p>
          )}
        </div>

        {/* Check mark on selected */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="ml-auto flex-shrink-0"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
