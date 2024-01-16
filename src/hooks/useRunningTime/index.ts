import { useState, useEffect, useRef } from "react";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";

/**
 * `useRunningTime` is a hook that returns the time elapsed since the start time. It refreshes every second.
 * @param startTime - The start time of the timer
 * @returns
 * - `runningTime` - The running time in milliseconds
 * - `endTimer` - A function that clears the timer
 */
export const useRunningTime = (startTime: Date) => {
  const [runningTime, setRunningTime] = useState(
    differenceInMilliseconds(Date.now(), startTime),
  );

  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newRunningTime = differenceInMilliseconds(Date.now(), startTime);
      setRunningTime(newRunningTime > 0 ? newRunningTime : 0);
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);

  const endTimer = () => clearInterval(timerRef.current);

  return { runningTime, endTimer };
};
