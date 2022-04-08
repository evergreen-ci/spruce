import React from "react";
import styled from "@emotion/styled";
import { format } from "date-fns";
import { StyledLink, StyledRouterLink } from "components/styles";
import { getHostRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TaskEventLogEntry } from "gql/generated/types";

const FORMAT_STR = "MMM d, yyyy, h:mm:ss aaaa";

export const TaskEventLogLine: React.VFC<TaskEventLogEntry> = ({
  timestamp,
  eventType,
  data,
}) => {
  const { hostId, status, userId, jiraIssue, jiraLink, priority } = data;
  const hostLink = getHostRoute(hostId);
  let message: JSX.Element;

  switch (eventType) {
    case "TASK_FINISHED":
      message = (
        <>
          Completed with status: <b>{status}</b>
        </>
      );
      break;
    case "TASK_STARTED":
      message = <>Marked as &quot;started&quot;</>;
      break;
    case "TASK_DISPATCHED":
      message = (
        <>
          Dispatched to host{" "}
          <StyledRouterLink to={hostLink}>{hostId}</StyledRouterLink>
        </>
      );
      break;
    case "TASK_UNDISPATCHED":
      message = (
        <>
          Undispatched from host{" "}
          <StyledRouterLink to={hostLink}>{hostId}</StyledRouterLink>
        </>
      );
      break;
    case "TASK_CREATED":
      message = (
        <>
          Undispatched from host{" "}
          <StyledRouterLink to={hostLink}>{hostId}</StyledRouterLink>
        </>
      );
      break;
    case "TASK_RESTARTED":
      message = <>Restarted by {userId}</>;
      break;
    case "TASK_ACTIVATED":
      message = <>Activated by {userId}</>;
      break;
    case "TASK_JIRA_ALERT_CREATED":
      message = (
        <>
          Created Jira Alert{" "}
          <StyledLink href={jiraLink}>
            <strong>{jiraIssue}</strong>
          </StyledLink>
        </>
      );
      break;
    case "TASK_DEACTIVATED":
      message = <>Deactivated by user {userId}</>;
      break;
    case "TASK_ABORT_REQUEST":
      message = <>Marked to abort by user {userId}</>;
      break;
    case "TASK_SCHEDULED":
      message = (
        <span className="cy-event-scheduled">
          Scheduled at {format(new Date(timestamp), FORMAT_STR)}
        </span>
      );
      break;
    case "TASK_PRIORITY_CHANGED":
      message = (
        <>
          Priority Changed to {priority} by {userId}
        </>
      );
      break;
    case "TASK_DEPENDENCIES_OVERRIDDEN":
      message = <>Dependencies overridden by user {userId}.</>;
      break;
    default:
      message = <></>;
  }

  return (
    <Row>
      <Timestamp className="cy-event-ts">
        {format(new Date(timestamp), FORMAT_STR)}
      </Timestamp>
      {message}
    </Row>
  );
};

const Row = styled.div`
  font-size: 16px;
  padding-top: ${size.xs};
  margin-bottom: ${size.xs};
  border-top: 1px dotted #ccc;
`;

const Timestamp = styled.span`
  margin-right: ${size.s};
`;
