import React from "react";
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

export const EventLogTab: React.FC = () => {
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
    <div>
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
                    sortBy={(datum: EventDiffLine) => datum?.key}
                  />,
                  <TableHeader
                    key="before"
                    label={<span data-cy="before">Before</span>}
                    sortBy={(datum: EventDiffLine) => datum?.before}
                  />,
                  <TableHeader
                    key="after"
                    label={<span data-cy="after">After</span>}
                    sortBy={(datum: EventDiffLine) => datum?.after}
                  />,
                ]}
              >
                {({ datum }) => (
                  <StyledRow key={datum?.key} data-cy="event-log-table-row">
                    <Cell>{datum?.key ? datum?.key : ""}</Cell>
                    <Cell>{getEventValue(datum?.before)}</Cell>
                    <Cell>{getEventValue(datum?.after)}</Cell>
                  </StyledRow>
                )}
              </Table>
            </EventLogCard>
          )
        )}
      </div>
    </div>
  );
};

interface Props {
  timestamp: Date;
  user: string;
}

export const EventLogHeader: React.VFC<Props> = ({ user, timestamp }) => (
  <StyledHeader>
    <div>
      <H3>{getDateCopy(timestamp)}</H3>
    </div>
    <div> {user} </div>
  </StyledHeader>
);

/* @ts-expect-error */
const EventLogCard = styled(Card)`
  margin-bottom: 48px;
  padding: ${size.m};
  width: 120%;
`;

const StyledRow = styled(Row)`
  td:first-of-type {
    width: 80%;
    word-break: break-all;
  }
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

  return JSON.stringify(value).split(",").join("\n");
};
