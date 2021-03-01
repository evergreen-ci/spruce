import React from "react";
import { useQuery, ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Skeleton } from "antd";
import get from "lodash/get";
import queryString from "query-string";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { Button } from "components/Button";
import { pollInterval } from "constants/index";
import {
  EventLogsQuery,
  EventLogsQueryVariables,
  SystemLogsQuery,
  SystemLogsQueryVariables,
  AgentLogsQuery,
  AgentLogsQueryVariables,
  TaskLogsQuery,
  TaskLogsQueryVariables,
  TaskEventLogEntry,
  LogMessageFragment,
} from "gql/generated/types";
import {
  GET_AGENT_LOGS,
  GET_EVENT_LOGS,
  GET_SYSTEM_LOGS,
  GET_TASK_LOGS,
} from "gql/queries";
import { useNetworkStatus } from "hooks";
import { RequiredQueryParams } from "types/task";
import { parseQueryString } from "utils";
import { LogMessageLine } from "./logTypes/LogMessageLine";
import { TaskEventLogLine } from "./logTypes/TaskEventLogLine";

const { gray } = uiColors;

interface TaskEventLogEntryType extends TaskEventLogEntry {
  kind?: "taskEventLogEntry";
}
interface LogMessageType extends LogMessageFragment {
  kind?: "logMessage";
}
export enum QueryParams {
  LogType = "logtype",
}
export enum LogTypes {
  Agent = "agent",
  System = "system",
  Task = "task",
  Event = "event",
}
interface Props {
  currentLog: LogTypes;
  htmlLink: string;
  rawLink: string;
}
export const EventLog: React.FC<Props> = (props): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    EventLogsQuery,
    EventLogsQueryVariables
  >(GET_EVENT_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);
  return useRenderBody({
    data: get(data, "taskLogs.eventLogs", []).map((v: TaskEventLogEntry) => ({
      ...v,
      kind: "taskEventLogEntry",
    })),
    loading,
    error,
    LogContainer: ({ children }) => <div>{children}</div>,
    ...props,
  });
};

export const SystemLog: React.FC<Props> = (props): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(GET_SYSTEM_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);

  return useRenderBody({
    data: get(data, "taskLogs.systemLogs", []),
    loading,
    error,
    ...props,
  });
};

export const AgentLog: React.FC<Props> = (props): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(GET_AGENT_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);

  return useRenderBody({
    data: get(data, "taskLogs.agentLogs", []),
    loading,
    error,
    ...props,
  });
};

export const TaskLog: React.FC<Props> = (props): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(GET_TASK_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);

  return useRenderBody({
    data: get(data, "taskLogs.taskLogs", []),
    loading,
    error,
    ...props,
  });
};

const useRenderBody: React.FC<{
  loading: boolean;
  error: ApolloError;
  data: [TaskEventLogEntryType | LogMessageType];
  currentLog: LogTypes;
  LogContainer?: React.FC;
  htmlLink: string;
  rawLink: string;
}> = ({
  loading,
  error,
  data,
  currentLog,
  rawLink,
  htmlLink,
  LogContainer = ({ children }) => <StyledPre>{children}</StyledPre>,
}) => {
  const { pathname } = useLocation();
  const { replace } = useHistory();
  const taskAnalytics = useTaskAnalytics();

  const hideLogs = error || !data.length;
  const onChangeLog = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextLogType = event.target.value as LogTypes;
    replace(
      `${pathname}?${queryString.stringify(
        {
          [QueryParams.LogType]: nextLogType,
        },
        { arrayFormat: "comma" }
      )}`
    );
    taskAnalytics.sendEvent({
      name: "Select Logs Type",
      logsType: nextLogType,
    });
  };

  let body = null;
  if (loading) {
    body = <Skeleton active title={false} paragraph={{ rows: 8 }} />;
  } else if (hideLogs) {
    body = <div data-cy="cy-no-logs">No logs found</div>;
  } else {
    body = (
      <LogContainer>
        {data.map((d, index) =>
          d.kind === "taskEventLogEntry" ? (
            <TaskEventLogLine
              key={`${d.resourceId}_${d.id}_${index}`} // eslint-disable-line react/no-array-index-key
              {...d}
            />
          ) : (
            <LogMessageLine
              key={`${d.message}_${d.timestamp}_${index}`} // eslint-disable-line react/no-array-index-key
              {...d}
            />
          )
        )}
      </LogContainer>
    );
  }

  return (
    <>
      <StyledRadioGroup
        size="default"
        onChange={onChangeLog}
        value={currentLog}
        name="log-select"
      >
        {(htmlLink || rawLink) && (
          <ButtonContainer>
            {htmlLink && (
              <Button
                data-cy="html-log-btn"
                target="_blank"
                href={htmlLink}
                onClick={() =>
                  taskAnalytics.sendEvent({ name: "Click Logs HTML Button" })
                }
              >
                HTML
              </Button>
            )}
            {rawLink && (
              <Button
                data-cy="raw-log-btn"
                target="_blank"
                href={rawLink}
                onClick={() =>
                  taskAnalytics.sendEvent({ name: "Click Logs Raw Button" })
                }
              >
                Raw
              </Button>
            )}
          </ButtonContainer>
        )}
        <Radio data-cy="task-radio" id="cy-task-radio" value={LogTypes.Task}>
          Task Logs
        </Radio>
        <Radio data-cy="agent-radio" id="cy-agent-radio" value={LogTypes.Agent}>
          Agent Logs
        </Radio>
        <Radio
          data-cy="system-radio"
          id="cy-system-radio"
          value={LogTypes.System}
        >
          System Logs
        </Radio>
        <Radio data-cy="event-radio" id="cy-event-radio" value={LogTypes.Event}>
          Event Logs
        </Radio>
      </StyledRadioGroup>
      {body}
    </>
  );
};

const ButtonContainer = styled.div`
  a:first-of-type {
    margin-right: 8px;
  }
  margin-right: 24px;
`;

// @ts-expect-error
const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  align-items: center;
  label {
    margin-right: 24px;
  }
  padding-bottom: 8px;
`;

const StyledPre = styled.pre`
  padding: 8px;
  word-break: break-all;
  word-wrap: break-word;
  border: 1px solid ${gray.light2};
  border-radius: 4px;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 13px;
`;
