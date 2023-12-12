import { useState, useEffect } from "react";
import { differenceInMilliseconds } from "date-fns";
import { MetadataItem } from "components/MetadataCard";
import { string } from "utils";

const { msToDuration } = string;

interface RuntimeTimerProps {
  startTime: Date;
}
const RuntimeTimer: React.FC<RuntimeTimerProps> = ({ startTime }) => {
  const parsedStartTime = new Date(startTime);

  const [runningTime, setRunningTime] = useState(
    differenceInMilliseconds(Date.now(), parsedStartTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newRunningTime = differenceInMilliseconds(
        Date.now(),
        parsedStartTime
      );
      setRunningTime(newRunningTime > 0 ? newRunningTime : 0);
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <MetadataItem data-cy="task-metadata-running-time">
      Running Time: {msToDuration(runningTime)}
    </MetadataItem>
  );
};

export default RuntimeTimer;
