import React, { useState, useEffect } from "react";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { P2 } from "components/Typography";
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

  const currentTime = Date.now();
  const [eta, setEta] = useState(
    differenceInMilliseconds(currentTime, estimatedCompletionTime)
  );

  const [runningTime, setRunningTime] = useState(
    differenceInMilliseconds(parsedStartTime, currentTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newEta = differenceInMilliseconds(
        estimatedCompletionTime,
        currentTime
      );
      const newRunningTime = differenceInMilliseconds(
        currentTime,
        parsedStartTime
      );
      setEta(newEta > 0 ? newEta : 0);
      setRunningTime(newRunningTime > 0 ? newRunningTime : 0);
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <>
      <P2 data-cy="task-metadata-running-time">
        Running Time:{" "}
        <span data-cy="metadata-eta-timer">{msToDuration(runningTime)}</span>
      </P2>
      {eta >= 0 && (
        <P2 data-cy="task-metadata-eta">
          ETA: <span>{msToDuration(eta)}</span>
        </P2>
      )}
    </>
  );
};
