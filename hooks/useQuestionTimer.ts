import { useState, useEffect, useRef } from 'react';

export function useQuestionTimer(
  duration: number,
  onExpire: () => void,
  active: boolean,
  resetKey: number   // increment this to restart the timer for a new question
) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);
  onExpireRef.current = onExpire;

  // Restart countdown whenever resetKey changes (new question) or active flips on
  useEffect(() => {
    if (!active) {
      expiredRef.current = false;
      return;
    }

    expiredRef.current = false;
    setTimeRemaining(duration);

    const id = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [active, resetKey, duration]);

  // Fire onExpire exactly once when time hits 0
  useEffect(() => {
    if (active && timeRemaining === 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current();
    }
  }, [timeRemaining, active]);

  const isWarning = timeRemaining <= 10 && timeRemaining > 0;

  return { timeRemaining, isWarning };
}
