import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { useParams } from "react-router-dom";
import { H3 } from "components/Typography";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
  RepoEventSettingsFragment,
  ProjectEventSettingsFragment,
} from "gql/generated/types";
import { GET_PROJECT_EVENT_LOGS, GET_REPO_EVENT_LOGS } from "gql/queries";
import { getDateCopy } from "utils/string";
import { ProjectType } from "../utils";
import { EventDiffLine, EventValue, getEventDiffLines } from "./EventLogDiffs";

type LogEntry = {
  timestamp: Date;
  user: string;
  before?: RepoEventSettingsFragment | ProjectEventSettingsFragment;
  after?: RepoEventSettingsFragment | ProjectEventSettingsFragment;
};

type TabProps = {
  projectType: ProjectType;
};

export const EventLogTab: React.VFC<TabProps> = ({ projectType }) => {
  const { identifier } = useParams<{ identifier: string }>();
  const isRepo = projectType === ProjectType.Repo;

  const dispatchToast = useToastContext();
  const { data: projectEventData } = useQuery<
    ProjectEventLogsQuery,
    ProjectEventLogsQueryVariables
  >(GET_PROJECT_EVENT_LOGS, {
    variables: { identifier },
    skip: isRepo,
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  const { data: repoEventData } = useQuery<
    RepoEventLogsQuery,
    RepoEventLogsQueryVariables
  >(GET_REPO_EVENT_LOGS, {
    variables: { identifier },
    skip: !isRepo,
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  const eventData: LogEntry[] = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries
    : projectEventData?.projectEvents?.eventLogEntries || [];

  return (
    <div data-cy="event-log">
      {eventData.map(({ user, timestamp, before, after }) => (
        /* @ts-expect-error */
        <EventLogCard key={`event_log_${timestamp}`}>
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
                  <StyledCell>{datum.key}</StyledCell>
                </Cell>
                <Cell>
                  <StyledCell>{getEventValue(datum.before)}</StyledCell>
                </Cell>
                <Cell>
                  <StyledCell>{getEventValue(datum.after)}</StyledCell>
                </Cell>
              </Row>
            )}
          </Table>
        </EventLogCard>
      ))}
    </div>
  );
};

interface Props {
  timestamp: Date;
  user: string;
}

const EventLogHeader: React.VFC<Props> = ({ user, timestamp }) => (
  <StyledHeader>
    <H3>{getDateCopy(timestamp)}</H3>
    <div>{user}</div>
  </StyledHeader>
);

/* @ts-expect-error */
const EventLogCard = styled(Card)`
  margin-bottom: ${size.l};
  padding: ${size.m};
  width: 150%;
`;

const StyledCell = styled.pre`
  word-break: break-all;
  font-size: 12px;
`;

const StyledHeader = styled.div`
  padding-bottom: ${size.l};
  padding-left: ${size.xxs};
`;

const getEventValue = (value: EventValue): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value).replaceAll(",", ",\n");
  }
};
