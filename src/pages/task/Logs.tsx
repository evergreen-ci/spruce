import React, { useEffect, useState } from "react";
import {
  GET_TASK_LOGS,
  TaskLogsQuery,
  TaskEventLogEntry,
  LogMessage
} from "../../gql/queries/get-task-logs";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import styled from "@emotion/styled/macro";
import { TaskEventLogLine } from "./logs/TaskEventLogLine";
import { LogMessageLine } from "./logs/LogMessageLine";

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

const renderLogs = ({
  currentLog,
  eventLogEntryData,
  logMessageData
}: {
  currentLog: LogTypes;
  eventLogEntryData: [TaskEventLogEntry];
  logMessageData: [LogMessage];
}): JSX.Element => {
  const noLogs = <div id="cy-no-logs">No logs</div>;
  if (currentLog === LogTypes.Event) {
    if (!eventLogEntryData.length) {
      return noLogs;
    }
    return (
      <>
        {eventLogEntryData.map((data, i) => (
          <TaskEventLogLine key={i} {...data} />
        ))}
      </>
    );
  }
  if (!logMessageData || !logMessageData.length) {
    return noLogs;
  }
  return (
    <>
      {logMessageData.map((data, i) => (
        <LogMessageLine key={i} {...data} />
      ))}
    </>
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

  // set current log based on query param
  useEffect(() => {
    if (
      logTypeParam === LogTypes.Agent ||
      logTypeParam === LogTypes.Event ||
      logTypeParam === LogTypes.System ||
      logTypeParam === LogTypes.Task
    ) {
      setCurrentLog(logTypeParam);
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
  const onChangeLog = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLogType = event.target.value as LogTypes;
    replace(
      `${pathname}?${queryString.stringify({
        [QueryParams.LogType]: nextLogType
      })}`
    );
  };

  let logMessageData: [LogMessage];
  switch (currentLog) {
    case LogTypes.Agent:
      logMessageData = data.taskLogs.agentLogs;
      break;
    case LogTypes.System:
      logMessageData = data.taskLogs.systemLogs;
      break;
    case LogTypes.Task:
      logMessageData = data.taskLogs.taskLogs;
      break;
    default:
      logMessageData = null;
  }

  const eventLogEntryData = data.taskLogs.eventLogs;
  return (
    <div>
      <StyledRadioGroup
        variant="default"
        onChange={onChangeLog}
        value={currentLog}
        name="log-select"
      >
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
      {renderLogs({ currentLog, eventLogEntryData, logMessageData })}
    </div>
  );
};

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  justify-content: space-between;
  width: 450px;
`;
