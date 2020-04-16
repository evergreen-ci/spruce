import React from "react";
import { TaskEventLogEntry } from "gql/queries/get-task-logs";
import styled from "@emotion/styled/macro";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { format } from "date-fns";
const FORMAT_STR = "MMM d, yyyy, h:mm:ss aaaa";

export const TaskEventLogLine: React.FC<TaskEventLogEntry> = (props) => {
  const { timestamp, eventType, data } = props;
  const hostLink = (
    <a href={`${getUiUrl()}/host/${data.hostId}`}>{data.hostId}</a>
  );
  let message: JSX.Element;
  switch (eventType) {
    case "TASK_FINISHED":
      message = (
        <>
          Completed with status: <b>{data.status}</b>
        </>
      );
      break;
    case "TASK_STARTED":
      message = <>Marked as "started"</>;
      break;
    case "TASK_DISPATCHED":
      message = <>Dispatched to host {hostLink}</>;
      break;
    case "TASK_UNDISPATCHED":
      message = <>Undispatched from host {hostLink}</>;
      break;
    case "TASK_CREATED":
      message = <>Undispatched from host {hostLink}</>;
      break;
    case "TASK_RESTARTED":
      message = <>Restarted by {data.userId}</>;
      break;
    case "TASK_ACTIVATED":
      message = <>Activated by {data.userId}</>;
      break;
    case "TASK_JIRA_ALERT_CREATED":
      message = (
        <>
          Created Jira Alert{" "}
          <a href={data.jiraLink}>
            <strong>{data.jiraIssue}</strong>
          </a>
        </>
      );
      break;
    case "TASK_DEACTIVATED":
      message = <>Deactivated by user {data.userId}</>;
      break;
    case "TASK_ABORT_REQUEST":
      message = <>Marked to abort by user {data.userId}</>;
      break;
    case "TASK_SCHEDULED":
      message = (
        <span className="cy-event-scheduled">
          Scheduled at {format(new Date(data.timestamp), FORMAT_STR)}
        </span>
      );
      break;
    case "TASK_PRIORITY_CHANGED":
      message = (
        <>
          Priority Changed to {data.priority} by {data.userId}
        </>
      );
      break;
    case "TASK_DEPENDENCIES_OVERRIDDEN":
      message = <>Dependencies overridden by user {data.userId}.</>;
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
  font-size: 1.2em;
  padding-top: 8px;
  margin-bottom: 8px;
  border-top: 1px dotted #ccc;
`;

const Timestamp = styled.span`
  margin-right: 15px;
`;
