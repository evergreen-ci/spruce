import React from "react";
import {
  GET_AGENT_LOGS,
  GET_EVENT_LOGS,
  GET_SYSTEM_LOGS,
  GET_TASK_LOGS,
} from "gql/queries/get-task-logs";
import queryString from "query-string";
import {
  EventLogsQuery,
  EventLogsQueryVariables,
  SystemLogsQuery,
  SystemLogsQueryVariables,
  AgentLogsQuery,
  AgentLogsQueryVariables,
  TaskLogsQuery,
  TaskLogsQueryVariables,
  LogMessage,
  TaskEventLogEntry,
} from "gql/generated/types";
import { useQuery } from "@apollo/react-hooks";
import { ApolloError } from "apollo-client";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Skeleton } from "antd";
import get from "lodash/get";
import { v4 as uuid } from "uuid";
import { LogMessageLine } from "pages/task/logs/logTypes/LogMessageLine";
import { TaskEventLogLine } from "pages/task/logs/logTypes/TaskEventLogLine";
import styled from "@emotion/styled";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Button } from "components/Button";

interface TaskEventLogEntryType extends TaskEventLogEntry {
  kind?: "taskEventLogEntry";
}
interface LogMessageType extends LogMessage {
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
  const { data, loading, error } = useQuery<
    EventLogsQuery,
    EventLogsQueryVariables
  >(GET_EVENT_LOGS, {
    variables: { id },
  });
  return useRenderBody({
    data: get(data, "taskLogs.eventLogs", []).map((v: TaskEventLogEntry) => ({
      ...v,
      kind: "taskEventLogEntry",
    })),
    loading,
    error,
    ...props,
  });
};

export const SystemLog: React.FC<Props> = (props): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(GET_SYSTEM_LOGS, {
    variables: { id },
  });
  return useRenderBody({
    data: get(data, "taskLogs.systemLogs", []),
    loading,
    error,
    ...props,
  });
};

export const AgentLog: React.FC<Props> = (props): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(GET_AGENT_LOGS, {
    variables: { id },
  });
  return useRenderBody({
    data: get(data, "taskLogs.agentLogs", []),
    loading,
    error,
    ...props,
  });
};

export const TaskLog: React.FC<Props> = (props): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(GET_TASK_LOGS, {
    variables: { id },
  });
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
  htmlLink: string;
  rawLink: string;
}> = ({ loading, error, data, currentLog, rawLink, htmlLink }) => {
  const { pathname } = useLocation();
  const { replace } = useHistory();
  if (loading) {
    return <Skeleton active title={false} paragraph={{ rows: 8 }} />;
  }
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
  };
  return (
    <>
      <StyledRadioGroup
        variant="default"
        onChange={onChangeLog}
        value={currentLog}
        name="log-select"
      >
        {!hideLogs ? (
          <ButtonContainer>
            {htmlLink && (
              <Button dataCy="html-log-btn" target="_blank" href={htmlLink}>
                HTML
              </Button>
            )}
            {rawLink && (
              <Button dataCy="raw-log-btn" target="_blank" href={rawLink}>
                Raw
              </Button>
            )}
          </ButtonContainer>
        ) : null}
        <Radio id="cy-task-radio" value={LogTypes.Task}>
          Task Logs
        </Radio>
        <Radio id="cy-agent-radio" value={LogTypes.Agent}>
          Agent Logs
        </Radio>
        <Radio id="cy-system-radio" value={LogTypes.System}>
          System Logs
        </Radio>
        <Radio id="cy-event-radio" value={LogTypes.Event}>
          Event Logs
        </Radio>
      </StyledRadioGroup>
      {hideLogs ? (
        <div id="cy-no-logs">No logs found</div>
      ) : (
        data.map((d) =>
          d.kind === "taskEventLogEntry" ? (
            <TaskEventLogLine key={uuid()} {...d} />
          ) : (
            <LogMessageLine key={uuid()} {...d} />
          )
        )
      )}
    </>
  );
};

const ButtonContainer = styled.div`
  a:first-of-type {
    margin-right: 8px;
  }
  margin-right: 24px;
`;
const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  align-items: center;
  label {
    margin-right: 24px;
  }
`;
