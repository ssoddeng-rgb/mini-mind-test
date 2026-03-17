'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { TestMeta } from '@/types/test';

interface TestCardProps {
  test: TestMeta;
  index: number;
}

const categoryLabels: Record<string, string> = {
  self: '자아',
  romance: '연애',
  friendship: '우정',
};

export default function TestCard({ test, index }: TestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/tests/${test.id}`} className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:shadow-2xl hover:shadow-purple-900/30 hover:-translate-y-1 active:scale-[0.98]">
          {/* Gradient background overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${test.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </div>

          <div className="relative p-5">
            {/* Top row: emoji and category badge */}
            <div className="flex items-start justify-between mb-3">
              <div className={`text-4xl p-2 rounded-xl bg-gradient-to-br ${test.gradient} bg-opacity-20 shadow-lg`}>
                <span role="img" aria-label={test.titleKo}>{test.emoji}</span>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
                {categoryLabels[test.category]}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-0.5 leading-tight">
              {test.titleKo}
            </h3>
            <p className="text-xs text-white/40 font-medium mb-2">
              {test.title}
            </p>

            {/* Description */}
            <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4">
              {test.descriptionKo}
            </p>

            {/* Footer info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {test.questionCount}문항
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  약 {test.estimatedMinutes}분
                </span>
              </div>

              {/* Start arrow */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${test.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
