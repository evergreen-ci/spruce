import { useParams } from "react-router-dom";
import { EventDiffTable, EventLog } from "components/Settings/EventLog";
import { LegacyEventEntry } from "./LegacyEventEntry";
import { useDistroEvents } from "./useDistroEvents";

type TabProps = {
  limit?: number;
};

export const EventLogTab: React.FC<TabProps> = ({ limit }) => {
  const { distroId } = useParams<{
    distroId: string;
  }>();

  const { allEventsFetched, events, fetchMore, loading } = useDistroEvents(
    distroId,
    limit,
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
      events={events}
      eventRenderer={({ after, before, data }) =>
        after && before ? (
          <EventDiffTable after={after} before={before} />
        ) : (
          <LegacyEventEntry data={data} />
        )
      }
      handleFetchMore={() => {
        fetchMore({
          variables: {
            distroId,
            before: lastEventTimestamp,
          },
        });
      }}
      loading={loading}
    />
  );
};
