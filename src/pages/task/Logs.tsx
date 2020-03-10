import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import styled from "@emotion/styled/macro";

//import { GET_TASK_LOGS } from "gql/queries/get-task-logs";

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

export const Logs: React.FC = props => {
  const { search } = useLocation();
  const parsed = queryString.parse(search);
  const [currentLog, setCurrentLog] = useState<LogTypes>(DEFAULT_LOG_TYPE);
  const logTypeParam = (parsed[QueryParams.LogType] || "")
    .toString()
    .toLowerCase();
  useEffect(() => {
    if (logTypeParam in LogTypes) {
      setCurrentLog(logTypeParam as LogTypes);
    } else {
      setCurrentLog(DEFAULT_LOG_TYPE);
    }
  }, [logTypeParam]);

  const onChangeLog = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setCurrentLog(event.target.value as LogTypes);
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
    </div>
  );
};

export const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  justify-content: space-between;
  width: 450px;
`;
