import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Subtitle } from "@leafygreen-ui/typography";
import { EventDiffLine, EventValue, getEventDiffLines } from "./EventLogDiffs";
import { Header } from "./Header";

export const EventLog = ({ allEventsFetched, events, fetchMore }) => {
  console.log("hi");
  return (
    <Container data-cy="event-log">
      {events.map(({ after, before, timestamp, user }) => (
        <EventLogCard key={`event_log_${timestamp}`} data-cy="event-log-card">
          <Header user={user} timestamp={timestamp} />
          <Table
            data={getEventDiffLines(before, after)}
            columns={[
              <TableHeader
                key="key"
                label="Property"
                sortBy={(datum: EventDiffLine) => datum.key}
              />,
              <TableHeader
                key="before"
                label="Before"
                sortBy={(datum: EventDiffLine) => JSON.stringify(datum.before)}
              />,
              <TableHeader
                key="after"
                label="After"
                sortBy={(datum: EventDiffLine) => JSON.stringify(datum.after)}
              />,
            ]}
          >
            {({ datum }) => (
              <Row key={datum.key} data-cy="event-log-table-row">
                <Cell>
                  <CellText>{datum.key}</CellText>
                </Cell>
                <Cell>
                  <CellText>{renderEventValue(datum.before)}</CellText>
                </Cell>
                <Cell>
                  {renderEventValue(datum.after) === null ? (
                    <Badge variant={Variant.Red}>Deleted</Badge>
                  ) : (
                    <CellText>{renderEventValue(datum.after)}</CellText>
                  )}
                </Cell>
              </Row>
            )}
          </Table>
        </EventLogCard>
      ))}
      {!allEventsFetched && !!events.length && (
        <Button
          data-cy="load-more-button"
          variant="primary"
          onClick={() => {
            fetchMore({
              variables: {
                identifier,
                before: lastEventTimestamp,
              },
            });
          }}
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

const CellText = styled.span`
  font-family: ${fontFamilies.code};
  font-size: 12px;
  line-height: 16px;
  word-break: break-all;
`;

const renderEventValue = (value: EventValue): string => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (typeof value === "number") {
    return value;
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value).replaceAll(",", ",\n");
  }

  return JSON.stringify(value);
};
