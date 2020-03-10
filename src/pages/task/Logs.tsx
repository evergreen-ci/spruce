import React, { useEffect, useState } from "react";
import {
  GET_TASK_LOGS,
  TaskLogsQuery,
  TaskEventLogData,
  LogMessage
} from "gql/queries/get-task-logs";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import styled from "@emotion/styled/macro";
import { getLogLineWrapper } from "components/styles/LogLines";

enum LogTypes {
  Agent = "agent",
  System = "system",
  Task = "task",
  Event = "event"
}

const DEFAULT_LOG_TYPE = LogTypes.Task;
enum QueryParams {
  LogType = "logtype"
}

const LogMessageLine = ({
  message,
  timestamp,
  severity
}: {
  message: string;
  timestamp: string;
  severity: string;
}) => {
  let time = "";
  if (timestamp) {
    const d = new Date(timestamp);
    // formats time YYYY/MM/DD HH:MM:SS.MS
    time = `[${d.getFullYear()}/${d.getMonth() +
      1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}}] `;
  }
  const LogLineWrapper = getLogLineWrapper(severity);
  return (
    <LogLineWrapper>
      {time}
      {message}
    </LogLineWrapper>
  );
};

export const Logs: React.FC = props => {
  const { id } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const [currentLog, setCurrentLog] = useState<LogTypes>(DEFAULT_LOG_TYPE);
  const { data, loading, error } = useQuery<TaskLogsQuery>(GET_TASK_LOGS, {
    variables: { id }
  });
  const parsed = queryString.parse(search);
  const logTypeParam = (parsed[QueryParams.LogType] || "")
    .toString()
    .toLowerCase();
  useEffect(() => {
    if (
      logTypeParam === LogTypes.Agent ||
      logTypeParam === LogTypes.Event ||
      logTypeParam === LogTypes.System ||
      logTypeParam === LogTypes.Task
    ) {
      setCurrentLog(logTypeParam as LogTypes);
    } else {
      setCurrentLog(DEFAULT_LOG_TYPE);
    }
  }, [logTypeParam]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const onChangeLog = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextLogType = event.target.value as LogTypes;
    replace(
      `${pathname}?${queryString.stringify({
        [QueryParams.LogType]: nextLogType
      })}`
    );
  };

  let currentData: [TaskEventLogData] | [LogMessage];
  switch (currentLog) {
    case LogTypes.Agent:
      currentData = data.taskLogs.agentLogs;
      break;
    case LogTypes.Event:
      currentData = data.taskLogs.systemLogs;
      break;
    case LogTypes.System:
      currentData = data.taskLogs.systemLogs;
      break;
    case LogTypes.Task:
      currentData = data.taskLogs.taskLogs;
      break;
    default:
      currentData = null;
  }
  return (
    <div>
      <StyledRadioGroup
        variant="default"
        onChange={onChangeLog}
        value={currentLog}
        name="log-select"
      >
        <Radio className="my-radio" value={LogTypes.Task}>
          Task Logs
        </Radio>
        <Radio className="my-radio" value={LogTypes.Agent}>
          Agent Logs
        </Radio>
        <Radio className="my-radio" value={LogTypes.System}>
          System Logs
        </Radio>
        <Radio className="my-radio" value={LogTypes.Event}>
          Event Logs
        </Radio>
      </StyledRadioGroup>
      {currentData == null || !currentData.length ? (
        <div>No logs</div>
      ) : currentLog !== LogTypes.Event ? (
        currentData.map(({ message, timestamp, severity }) => (
          <LogMessageLine
            message={message}
            timestamp={timestamp}
            severity={severity}
          />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  justify-content: space-between;
  width: 450px;
`;
