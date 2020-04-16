import React, { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { useLocation, useHistory } from "react-router-dom";
import { EventLog, AgentLog, SystemLog, TaskLog } from "./logs/LogTypes";
import queryString from "query-string";
import styled from "@emotion/styled/macro";

enum LogTypes {
  Agent = "agent",
  System = "system",
  Task = "task",
  Event = "event",
}
const DEFAULT_LOG_TYPE = LogTypes.Task;
enum QueryParams {
  LogType = "logtype",
}

const options = {
  [LogTypes.Agent]: <AgentLog />,
  [LogTypes.System]: <SystemLog />,
  [LogTypes.Task]: <TaskLog />,
  [LogTypes.Event]: <EventLog />,
};

export const Logs: React.FC = (props) => {
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const [currentLog, setCurrentLog] = useState<LogTypes>(DEFAULT_LOG_TYPE);
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

  const onChangeLog = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLogType = event.target.value as LogTypes;
    replace(
      `${pathname}?${queryString.stringify({
        [QueryParams.LogType]: nextLogType,
      })}`
    );
  };

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
      {options[currentLog] || <></>}
    </div>
  );
};

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  justify-content: space-between;
  width: 450px;
`;
