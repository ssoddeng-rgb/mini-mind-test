'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ResultType } from '@/types/test';

interface CompatibleTypesProps {
  result: ResultType;
  allResults: ResultType[];
  testId: string;
}

export default function CompatibleTypes({ result, allResults, testId }: CompatibleTypesProps) {
  if (!result.compatibleWith?.length) return null;

  const compatible = allResults.filter(r => result.compatibleWith!.includes(r.id));
  if (!compatible.length) return null;

  // Others = types not compatible and not self
  const others = allResults.filter(
    r => r.id !== result.id && !result.compatibleWith!.includes(r.id)
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span aria-hidden="true">💞</span>
        궁합 유형
      </h2>

      {/* Compatible */}
      <p className="text-xs text-white/40 uppercase tracking-wider mb-3">잘 맞는 유형</p>
      <div className="space-y-3 mb-6">
        {compatible.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={`/tests/${testId}/results/${r.id}/`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-white text-sm">{r.titleKo}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">잘 맞음</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                  {result.compatibleDescriptionKo ?? r.descriptionKo.slice(0, 60) + '...'}
                </p>
              </div>
              <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* All types grid */}
      {others.length > 0 && (
        <>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">다른 유형 탐색</p>
          <div className="flex flex-wrap gap-2">
            {others.map(r => (
              <Link
                key={r.id}
                href={`/tests/${testId}/results/${r.id}/`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-200 text-sm text-white/50 hover:text-white/80"
              >
                <span>{r.emoji}</span>
                <span>{r.titleKo}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
