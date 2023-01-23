import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { Subtitle } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { size } from "constants/tokens";
import { useDateFormat } from "hooks";

import { ProjectType } from "../utils";
import { EventDiffLine, EventValue, getEventDiffLines } from "./EventLogDiffs";
import { useEvents } from "./useEvents";

type TabProps = {
  limit?: number;
  projectType: ProjectType;
};

export const EventLogTab: React.VFC<TabProps> = ({
  limit = 15,
  projectType,
}) => {
  const { projectIdentifier: identifier } = useParams<{
    projectIdentifier: string;
  }>();

  const isRepo = projectType === ProjectType.Repo;
  const { events, fetchMore, showLoadButton } = useEvents(
    identifier,
    isRepo,
    limit
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <Container data-cy="event-log">
      {events.map(({ user, timestamp, before, after }) => (
        <EventLogCard key={`event_log_${timestamp}`} data-cy="event-log-card">
          <EventLogHeader user={user} timestamp={timestamp} />
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
                  <CellText>{getEventValue(datum.before)}</CellText>
                </Cell>
                <Cell>
                  {getEventValue(datum.after) === null ? (
                    <Badge variant={Variant.Red}>Deleted</Badge>
                  ) : (
                    <CellText>{getEventValue(datum.after)}</CellText>
                  )}
                </Cell>
              </Row>
            )}
          </Table>
        </EventLogCard>
      ))}
      {showLoadButton && (
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
    </Container>
  );
};

interface Props {
  timestamp: Date;
  user: string;
}

const EventLogHeader: React.VFC<Props> = ({ user, timestamp }) => {
  const getDateCopy = useDateFormat();
  return (
    <StyledHeader>
      <Subtitle>{getDateCopy(timestamp)}</Subtitle>
      <div>{user}</div>
    </StyledHeader>
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

const StyledHeader = styled.div`
  padding-bottom: ${size.s};
`;

const getEventValue = (value: EventValue): string => {
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
