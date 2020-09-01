import React, { useState, useEffect } from "react";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { msToDuration } from "utils/string";

interface ETATimerProps {
  startTime: Date;
  baseTaskDuration: number;
}
export const ETATimer: React.FC<ETATimerProps> = ({
  startTime,
  baseTaskDuration,
}) => {
  const parsedStartTime = new Date(startTime);
  const estimatedCompletionTime = addMilliseconds(
    parsedStartTime,
    baseTaskDuration
  );

  const [eta, setEta] = useState(
    differenceInMilliseconds(Date.now(), estimatedCompletionTime)
  );

  const [runningTime, setRunningTime] = useState(
    differenceInMilliseconds(parsedStartTime, Date.now())
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentTime = Date.now();
      setEta(differenceInMilliseconds(estimatedCompletionTime, currentTime));
      setRunningTime(differenceInMilliseconds(currentTime, parsedStartTime));
    }, 1000);
    return () => clearTimeout(timer);
  });
  // Sometimes if the task takes longer then expected the eta becomes negative which
  // doesn't make sense so in those cases we hide it
  return (
    <span data-cy="metadata-eta-timer">
      {msToDuration(runningTime)}
      {eta >= 0 && ` / ${msToDuration(eta)}`}
    </span>
  );
};
