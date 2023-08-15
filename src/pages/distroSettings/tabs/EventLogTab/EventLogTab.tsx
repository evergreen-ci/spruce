import { useParams } from "react-router-dom";
import { EventLog } from "components/Settings/EventLog";
import { useDistroEvents } from "./useDistroEvents";

type TabProps = {
  limit?: number;
};

export const EventLogTab: React.FC<TabProps> = ({ limit }) => {
  const { distroId } = useParams<{
    distroId: string;
  }>();

  const { allEventsFetched, events, fetchMore } = useDistroEvents(
    distroId,
    limit
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
      events={events}
      handleFetchMore={() => {
        fetchMore({
          variables: {
            distroId,
            before: lastEventTimestamp,
          },
        });
      }}
    />
  );
};
