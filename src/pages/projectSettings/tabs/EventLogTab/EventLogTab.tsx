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
import { validateObjectId } from "utils/validators";
import { EventDiffLine, getEventDiffLines } from "./EventLogDiffs";

export const EventLogTab: React.VFC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const isRepo = validateObjectId(identifier);

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

  type logEntry = {
    timestamp: Date;
    user: string;
    before?: RepoEventSettingsFragment | ProjectEventSettingsFragment;
    after?: RepoEventSettingsFragment | ProjectEventSettingsFragment;
  };

  const eventData = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries
    : projectEventData?.projectEvents?.eventLogEntries;

  return (
    <div data-cy="event-log">
      {((eventData as logEntry[]) || []).map(
        ({ user, timestamp, before, after }) => (
          /* @ts-expect-error */
          <EventLogCard key={`event_log_${timestamp}`}>
            <EventLogHeader user={user} timestamp={timestamp} />
            <Table
              data={getEventDiffLines(before, after)}
              columns={[
                <TableHeader
                  key="key"
                  label={<span data-cy="key">Property</span>}
                  sortBy={(datum: EventDiffLine) => datum.key}
                />,
                <TableHeader
                  key="before"
                  label={<span data-cy="before">Before</span>}
                  sortBy={(datum: EventDiffLine) => datum.before}
                />,
                <TableHeader
                  key="after"
                  label={<span data-cy="after">After</span>}
                  sortBy={(datum: EventDiffLine) => datum.after}
                />,
              ]}
            >
              {({ datum }) => (
                <Row key={datum.key} data-cy="event-log-table-row">
                  <Cell>
                    <StyledCell>{datum.key ?? ""}</StyledCell>
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
        )
      )}
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

    <div> {user} </div>
  </StyledHeader>
);

/* @ts-expect-error */
const EventLogCard = styled(Card)`
  margin-bottom: 48px;
  padding: ${size.m};
  width: 150%;
`;

const StyledCell = styled("div")`
  word-break: break-all;
  font-size: 12px;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
`;

const StyledHeader = styled("div")`
  padding-bottom: ${size.l};
  padding-left: ${size.xxs};
`;

const getEventValue = (value: any) => {
  if (value === true) {
    return "true";
  }
  if (value === false) {
    return "false";
  }
  if (value === null || value === undefined) {
    return "";
  }

  if (value === "") {
    return '""';
  }

  const splitArray = JSON.stringify(value).split(",");

  return (
    <div>
      {splitArray.map((item, index) => (
        <div key={item}>
          {item}
          {index !== splitArray.length - 1 && ","}
        </div>
      ))}
    </div>
  );
};
