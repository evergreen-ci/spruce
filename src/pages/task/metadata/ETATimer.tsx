import { useState, useEffect } from "react";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { MetadataItem } from "components/MetadataCard";
import { string } from "utils";

const { msToDuration } = string;
interface ETATimerProps {
  startTime: Date;
  expectedDuration: number;
}
export const ETATimer: React.FC<ETATimerProps> = ({
  expectedDuration,
  startTime,
}) => {
  const parsedStartTime = new Date(startTime);
  const estimatedCompletionTime = addMilliseconds(
    parsedStartTime,
    expectedDuration
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
    if (eta === 0 || runningTime === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  });

  return (
    <>
      <MetadataItem data-cy="task-metadata-running-time">
        Running Time:{" "}
        <span data-cy="metadata-eta-timer">{msToDuration(runningTime)}</span>
      </MetadataItem>
      {eta >= 0 && (
        <MetadataItem data-cy="task-metadata-eta">
          ETA: <span>{msToDuration(eta)}</span>
        </MetadataItem>
      )}
    </>
  );
};
