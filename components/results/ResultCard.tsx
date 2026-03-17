'use client';
import { motion } from 'framer-motion';
import type { ResultType, TestMeta } from '@/types/test';

interface ResultCardProps {
  result: ResultType;
  meta: TestMeta;
}

export default function ResultCard({ result, meta }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Main result display */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${result.gradient} p-8 mb-4 shadow-2xl`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-4 right-4 text-8xl rotate-12 opacity-30">{result.emoji}</div>
          <div className="absolute bottom-4 left-4 text-6xl -rotate-12 opacity-20">{meta.emoji}</div>
        </div>

        <div className="relative">
          {/* Category chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4 backdrop-blur-sm">
            <span aria-hidden="true">{meta.emoji}</span>
            {meta.titleKo}
          </div>

          {/* Result emoji + title */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="text-6xl mb-4"
            role="img"
            aria-label={result.titleKo}
          >
            {result.emoji}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wider">당신의 결과</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-1 leading-tight">
              {result.titleKo}
            </h1>
            <p className="text-white/60 text-base font-medium">{result.title}</p>
          </motion.div>
        </div>
      </div>

      {/* Description card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-4"
      >
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span aria-hidden="true">💡</span>
          당신에 대해
        </h2>
        <p className="text-white/70 leading-relaxed text-base">
          {result.descriptionKo}
        </p>
      </motion.div>

      {/* Traits */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-4"
      >
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span aria-hidden="true">⭐</span>
          핵심 특성
        </h2>
        <div className="flex flex-wrap gap-2">
          {result.traitsKo.map((trait, idx) => (
            <motion.span
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + idx * 0.05 }}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${result.gradient} text-white shadow-md`}
            >
              {trait}
            </motion.span>
          ))}
        </div>
        {result.traits.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {result.traits.map((trait, idx) => (
              <span
                key={trait}
                className="px-3 py-1 rounded-full text-xs text-white/40 border border-white/10"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Compatible types (if available) */}
      {result.compatibleWith && result.compatibleWith.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-4"
        >
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span aria-hidden="true">🤝</span>
            잘 맞는 유형
          </h2>
          <div className="flex flex-wrap gap-2">
            {result.compatibleWith.map((typeId) => (
              <span
                key={typeId}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white/70 border border-white/10"
              >
                {typeId}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
