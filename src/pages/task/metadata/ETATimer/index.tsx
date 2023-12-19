import { useEffect } from "react";
import { MetadataItem } from "components/MetadataCard";
import { useRunningTime } from "hooks";
import { string } from "utils";

const { msToDuration } = string;

interface ETATimerProps {
  startTime: Date;
  expectedDuration: number;
}
const ETATimer: React.FC<ETATimerProps> = ({ expectedDuration, startTime }) => {
  const parsedStartTime = new Date(startTime);
  const { endTimer, runningTime } = useRunningTime(parsedStartTime);

  useEffect(() => {
    if (runningTime >= expectedDuration) {
      endTimer();
    }
  }, [runningTime, expectedDuration, endTimer]);

  const eta = expectedDuration - runningTime;
  return (
    <MetadataItem data-cy="task-metadata-eta">
      ETA: {msToDuration(eta)}
    </MetadataItem>
  );
};

export default ETATimer;
