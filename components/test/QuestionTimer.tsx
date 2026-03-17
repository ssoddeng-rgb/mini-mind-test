'use client';

interface QuestionTimerProps {
  timeRemaining: number;
  duration: number;
  isWarning: boolean;
}

export default function QuestionTimer({ timeRemaining, duration, isWarning }: QuestionTimerProps) {
  const size = 56;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = timeRemaining / duration;
  const dashOffset = circumference * (1 - progress);

  const color = isWarning ? '#f97316' : '#8b5cf6';
  const bgColor = isWarning ? 'rgba(249,115,22,0.15)' : 'rgba(139,92,246,0.15)';

  return (
    <div className="relative flex items-center justify-center" aria-label={`남은 시간: ${timeRemaining}초`} role="timer">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={bgColor}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="timer-arc"
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
          }}
        />
      </svg>
      {/* Time text */}
      <span
        className={`absolute text-sm font-bold tabular-nums transition-colors duration-300 ${
          isWarning ? 'text-orange-400' : 'text-white/80'
        }`}
      >
        {timeRemaining}
      </span>
    </div>
  );
}
