import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Card from "@leafygreen-ui/card";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { Subtitle } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  ProjectEventSettingsFragment,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_EVENT_LOGS, GET_REPO_EVENT_LOGS } from "gql/queries";
import { useDateFormat } from "hooks";

import { ProjectType } from "../utils";
import { EventDiffLine, EventValue, getEventDiffLines } from "./EventLogDiffs";

type LogEntry = {
  timestamp: Date;
  user: string;
  before?: ProjectEventSettingsFragment;
  after?: ProjectEventSettingsFragment;
};

type TabProps = {
  projectType: ProjectType;
};

export const EventLogTab: React.VFC<TabProps> = ({ projectType }) => {
  const { projectIdentifier: identifier } = useParams<{
    projectIdentifier: string;
  }>();
  const isRepo = projectType === ProjectType.Repo;

  const dispatchToast = useToastContext();
  const { data: projectEventData } = useQuery<
    ProjectEventLogsQuery,
    ProjectEventLogsQueryVariables
  >(GET_PROJECT_EVENT_LOGS, {
    variables: { identifier },
    errorPolicy: "all",
    skip: isRepo,
    fetchPolicy: "no-cache",
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  const { data: repoEventData } = useQuery<
    RepoEventLogsQuery,
    RepoEventLogsQueryVariables
  >(GET_REPO_EVENT_LOGS, {
    variables: { id: identifier },
    errorPolicy: "all",
    skip: !isRepo,
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  const eventData: LogEntry[] = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  return (
    <div data-cy="event-log">
      {eventData.map(({ user, timestamp, before, after }) => (
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
    </div>
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

const EventLogCard = styled(Card)`
  margin-bottom: ${size.l};
  padding: ${size.m};
  width: 150%;
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
