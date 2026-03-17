'use client';
import { motion } from 'framer-motion';
import { useResultStats } from '@/hooks/useResultStats';
import type { ResultType, TestMeta } from '@/types/test';

interface ResultStatsProps {
  testId: string;
  currentResultId: string;
  results: ResultType[];
  meta: TestMeta;
}

export default function ResultStats({ testId, currentResultId, results, meta }: ResultStatsProps) {
  const { stats, totalCount } = useResultStats(testId, currentResultId, results);

  const resultMap = Object.fromEntries(results.map(r => [r.id, r]));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <span aria-hidden="true">📊</span>
        이 테스트를 한 사람들의 결과
      </h2>
      <p className="text-xs text-white/40 mb-5">
        누적 {totalCount.toLocaleString()}명의 결과 분포
      </p>

      <div className="space-y-3">
        {stats.map((stat, idx) => {
          const result = resultMap[stat.resultId];
          if (!result) return null;
          const isCurrent = stat.resultId === currentResultId;

          return (
            <motion.div
              key={stat.resultId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg w-7 text-center" aria-hidden="true">{result.emoji}</span>
                <span className={`text-sm font-medium flex-1 ${isCurrent ? 'text-white' : 'text-white/60'}`}>
                  {result.titleKo}
                  {isCurrent && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white/80">나</span>
                  )}
                </span>
                <span className={`text-sm font-bold tabular-nums ${isCurrent ? 'text-white' : 'text-white/50'}`}>
                  {stat.percentage}%
                </span>
              </div>

              {/* Bar */}
              <div className="ml-10 h-2.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${isCurrent ? result.gradient : 'from-white/20 to-white/30'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ delay: idx * 0.06 + 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-white/20 mt-5 text-center">
        * 방문자 데이터 기반 통계 · 참고용
      </p>
    </div>
  );
}
