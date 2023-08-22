import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Spinner } from "@leafygreen-ui/loading-indicator";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { EventDiffTable } from "./EventDiffTable";
import { Header } from "./Header";
import { Event } from "./types";

type EventLogProps = {
  allEventsFetched: boolean;
  eventRenderer?: (event: Event) => React.ReactNode;
  events: Event[];
  handleFetchMore: () => void;
  loading?: boolean;
};

export const EventLog: React.FC<EventLogProps> = ({
  allEventsFetched,
  eventRenderer,
  events,
  handleFetchMore,
  loading,
}) => {
  const allEventsFetchedCopy =
    events.length > 0 ? "No more events to show." : "No events to show.";

  return (
    <Container data-cy="event-log">
      {events.map((event) => {
        const { after, before, timestamp, user } = event;
        return (
          <EventLogCard key={`event_log_${timestamp}`} data-cy="event-log-card">
            <Header user={user} timestamp={timestamp} />
            {eventRenderer ? (
              eventRenderer(event)
            ) : (
              <EventDiffTable after={after} before={before} />
            )}
          </EventLogCard>
        );
      })}
      {!allEventsFetched && !!events.length && (
        <Button
          data-cy="load-more-button"
          isLoading={loading}
          loadingIndicator={<Spinner />}
          onClick={handleFetchMore}
          variant="primary"
        >
          Load more events
        </Button>
      )}
      {allEventsFetched && <Subtitle>{allEventsFetchedCopy}</Subtitle>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150%;
`;

const EventLogCard = styled(Card)`
  width: 100%;
  margin-bottom: ${size.l};
  padding: ${size.m};
`;
