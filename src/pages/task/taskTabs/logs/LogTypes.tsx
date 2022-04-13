import { useQuery, ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Skeleton } from "antd";
import get from "lodash/get";
import { useParams, useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { Button } from "components/Button";
import { pollInterval } from "constants/index";
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
import { usePolling, useUpdateURLQueryParams } from "hooks";
import { RequiredQueryParams, LogTypes, QueryParams } from "types/task";
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
}

export const AllLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    AllLogsQuery,
    AllLogsQueryVariables
  >(GET_ALL_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  usePolling(startPolling, stopPolling);

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
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    TaskEventLogsQuery,
    TaskEventLogsQueryVariables
  >(GET_TASK_EVENT_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  usePolling(startPolling, stopPolling);

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
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(GET_SYSTEM_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  usePolling(startPolling, stopPolling);

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
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(GET_AGENT_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  usePolling(startPolling, stopPolling);

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
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(GET_TASK_LOGS, {
    variables: { id, execution: selectedExecution },
    pollInterval,
  });
  usePolling(startPolling, stopPolling);

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
  currentLog: LogTypes;
  LogContainer?: React.VFC<{ children: React.ReactNode }>;
  htmlLink: string;
  rawLink: string;
  lobsterLink: string;
}> = ({
  loading,
  error,
  data,
  currentLog,
  rawLink,
  htmlLink,
  lobsterLink,
  LogContainer = ({ children }) => <StyledPre>{children}</StyledPre>,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const noLogs = !!((error && !data) || !data.length);
  const onChangeLog = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextLogType = event.target.value as LogTypes;
    updateQueryParams({ [QueryParams.LogType]: nextLogType });
    taskAnalytics.sendEvent({
      name: "Select Logs Type",
      logsType: nextLogType,
    });
  };

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

  return (
    <>
      <StyledRadioGroup
        size="default"
        onChange={onChangeLog}
        value={currentLog}
        name="log-select"
      >
        {(htmlLink || rawLink || lobsterLink) && (
          <ButtonContainer>
            {rawLink && (
              <Button
                data-cy="lobster-log-btn"
                disabled={noLogs}
                href={lobsterLink}
                target="_blank"
                onClick={() =>
                  taskAnalytics.sendEvent({ name: "Click Logs Lobster Button" })
                }
              >
                Lobster
              </Button>
            )}
            {htmlLink && (
              <Button
                data-cy="html-log-btn"
                disabled={noLogs}
                href={htmlLink}
                target="_blank"
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
                disabled={noLogs}
                href={rawLink}
                target="_blank"
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
        <Radio data-cy="all-radio" id="cy-all-radio" value={LogTypes.All}>
          All Logs
        </Radio>
      </StyledRadioGroup>
      {body}
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  > :not(:last-child) {
    margin-right: ${size.xs};
  }
  margin-right: ${size.s};
  padding-left: 1px;
`;

// @ts-expect-error
const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  label {
    margin-right: ${size.s};
  }
  padding-bottom: ${size.xs};
`;

const StyledPre = styled.pre`
  padding: ${size.xs};
  word-break: break-all;
  word-wrap: break-word;
  border: 1px solid ${gray.light2};
  border-radius: ${size.xxs};
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: ${fontSize.m};
`;
