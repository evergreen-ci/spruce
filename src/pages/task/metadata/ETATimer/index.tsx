import { useState, useEffect } from "react";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { MetadataItem } from "components/MetadataCard";
import { string } from "utils";

const { msToDuration } = string;

interface ETATimerProps {
  startTime: Date;
  expectedDuration: number;
}
const ETATimer: React.FC<ETATimerProps> = ({ expectedDuration, startTime }) => {
  const parsedStartTime = new Date(startTime);
  const estimatedCompletionTime = addMilliseconds(
    parsedStartTime,
    expectedDuration
  );

  const [eta, setEta] = useState(
    differenceInMilliseconds(estimatedCompletionTime, Date.now())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newEta = differenceInMilliseconds(
        estimatedCompletionTime,
        Date.now()
      );
      setEta(newEta > 0 ? newEta : 0);
      if (newEta <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MetadataItem data-cy="task-metadata-eta">
      ETA: {msToDuration(eta)}
    </MetadataItem>
  );
};

export default ETATimer;
