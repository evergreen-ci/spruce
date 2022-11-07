import { useEffect } from "react";
import { useQuery, ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import get from "lodash/get";
import { useParams, useLocation } from "react-router-dom";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { size, fontSize } from "constants/tokens";
import {
  TaskEventLogsQuery,
  TaskEventLogsQueryVariables,
  SystemLogsQuery,
  SystemLogsQueryVariables,
  AgentLogsQuery,
  AgentLogsQueryVariables,
  TaskLogsQuery,
  TaskLogsQueryVariables,
  AllLogsQuery,
  AllLogsQueryVariables,
  TaskEventLogEntry,
  LogMessageFragment,
} from "gql/generated/types";
import {
  GET_AGENT_LOGS,
  GET_TASK_EVENT_LOGS,
  GET_SYSTEM_LOGS,
  GET_TASK_LOGS,
  GET_ALL_LOGS,
} from "gql/queries";
import { usePolling } from "hooks";
import { RequiredQueryParams, LogTypes } from "types/task";
import { queryString } from "utils";
import { LogMessageLine } from "./logTypes/LogMessageLine";
import { TaskEventLogLine } from "./logTypes/TaskEventLogLine";

const { parseQueryString } = queryString;

const { gray } = uiColors;

interface TaskEventLogEntryType extends TaskEventLogEntry {
  kind?: "taskEventLogEntry";
}
interface LogMessageType extends LogMessageFragment {
  kind?: "logMessage";
}
interface Props {
  currentLog: LogTypes;
  htmlLink: string;
  rawLink: string;
  lobsterLink: string;
  setNoLogs: (noLogs: boolean) => void;
}

export const AllLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);

  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    AllLogsQuery,
    AllLogsQueryVariables
  >(GET_ALL_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  // All logs includes task, system, and agent logs. Event logs are not included.
  return useRenderBody({
    data: get(data, "taskLogs.allLogs", []),
    loading,
    error,
    ...props,
  });
};

export const EventLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    TaskEventLogsQuery,
    TaskEventLogsQueryVariables
  >(GET_TASK_EVENT_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

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

export const SystemLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(GET_SYSTEM_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  return useRenderBody({
    data: get(data, "taskLogs.systemLogs", []),
    loading,
    error,
    ...props,
  });
};

export const AgentLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(GET_AGENT_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  return useRenderBody({
    data: get(data, "taskLogs.agentLogs", []),
    loading,
    error,
    ...props,
  });
};

export const TaskLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(GET_TASK_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  return useRenderBody({
    data: get(data, "taskLogs.taskLogs", []),
    loading,
    error,
    ...props,
  });
};

const useRenderBody: React.VFC<{
  loading: boolean;
  error: ApolloError;
  data: (TaskEventLogEntryType | LogMessageType)[];
  LogContainer?: React.VFC<{ children: React.ReactNode }>;
  setNoLogs: (noLogs: boolean) => void;
}> = ({
  loading,
  error,
  data,
  LogContainer = ({ children }) => <StyledPre>{children}</StyledPre>,
  setNoLogs,
}) => {
  const noLogs = !!((error && !data) || !data.length);
  // Update the value of noLogs in the parent component.
  useEffect(() => {
    setNoLogs(noLogs);
  }, [setNoLogs, noLogs]);

  let body = null;
  if (loading) {
    body = <Skeleton active title={false} paragraph={{ rows: 8 }} />;
  } else if (noLogs) {
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

  return body;
};

const StyledPre = styled.pre`
  padding: ${size.xs};
  word-break: break-all;
  word-wrap: break-word;
  border: 1px solid ${gray.light2};
  border-radius: ${size.xxs};
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: ${fontSize.m};
`;
