'use client';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  gradient: string;
}

export default function ProgressBar({ current, total, gradient }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={`질문 ${current} / ${total}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/40 font-medium">
          {current} / {total}
        </span>
        <span className="text-xs text-white/40 font-medium">
          {percentage}%
        </span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
