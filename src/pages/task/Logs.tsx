import React, { useEffect, useState } from "react";
import { GET_TASK_LOGS, TaskLogsQuery } from "gql/queries/get-task-logs";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import styled from "@emotion/styled/macro";

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
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const [currentLog, setCurrentLog] = useState<LogTypes>(DEFAULT_LOG_TYPE);
  const { data, loading, error } = useQuery<TaskLogsQuery>(GET_TASK_LOGS);
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

  const onChangeLog = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextLogType = event.target.value as LogTypes;
    replace(
      `${pathname}?${queryString.stringify({
        [QueryParams.LogType]: nextLogType
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
