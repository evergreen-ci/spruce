import React, { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import styled from "@emotion/styled/macro";
import {
  EventLog,
  AgentLog,
  SystemLog,
  TaskLog,
} from "pages/task/logs/LogTypes";
import Maybe from "graphql/tsutils/Maybe";
import { Button } from "components/Button";
import { useTaskAnalytics } from "analytics";
import { LogTypes } from "types/task";

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

interface LogLinks {
  allLogLink?: Maybe<string>;
  agentLogLink?: Maybe<string>;
  systemLogLink?: Maybe<string>;
  taskLogLink?: Maybe<string>;
  eventLogLink?: Maybe<string>;
}

interface Props {
  logLinks: LogLinks;
}
export const Logs: React.FC<Props> = ({ logLinks }) => {
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const [currentLog, setCurrentLog] = useState<LogTypes>(DEFAULT_LOG_TYPE);
  const parsed = queryString.parse(search);
  const logTypeParam = (parsed[QueryParams.LogType] || "")
    .toString()
    .toLowerCase();
  const taskAnalytics = useTaskAnalytics();

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

  const { htmlLink, rawLink } = getLinks(logLinks, currentLog);

  return (
    <div>
      <StyledRadioGroup
        variant="default"
        onChange={onChangeLog}
        value={currentLog}
        name="log-select"
      >
        <ButtonContainer>
          {htmlLink && (
            <Button
              dataCy="html-log-btn"
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
              dataCy="raw-log-btn"
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
        <Radio
          id="cy-task-radio"
          value={LogTypes.Task}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Select Logs Type",
              logsType: LogTypes.Task,
            })
          }
        >
          Task Logs
        </Radio>
        <Radio
          id="cy-agent-radio"
          value={LogTypes.Agent}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Select Logs Type",
              logsType: LogTypes.Agent,
            })
          }
        >
          Agent Logs
        </Radio>
        <Radio
          id="cy-system-radio"
          value={LogTypes.System}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Select Logs Type",
              logsType: LogTypes.System,
            })
          }
        >
          System Logs
        </Radio>
        <Radio
          id="cy-event-radio"
          value={LogTypes.Event}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Select Logs Type",
              logsType: LogTypes.Event,
            })
          }
        >
          Event Logs
        </Radio>
      </StyledRadioGroup>
      {options[currentLog] || <></>}
    </div>
  );
};

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  align-items: center;
  label {
    margin-left: 24px;
  }
`;

interface GetLinksResult {
  htmlLink?: string;
  rawLink?: string;
}

const getLinks = (logLinks: LogLinks, logType: LogTypes): GetLinksResult => {
  if (!logLinks) {
    return {};
  }
  const linkTypes = {
    [LogTypes.Agent]: logLinks.agentLogLink,
    [LogTypes.Event]: logLinks.eventLogLink,
    [LogTypes.System]: logLinks.systemLogLink,
    [LogTypes.Task]: logLinks.taskLogLink,
  };
  const url = linkTypes[logType];
  if (!url) {
    return {};
  }
  if (logType === LogTypes.Event) {
    return { htmlLink: url };
  }
  return { htmlLink: url, rawLink: `${url}&text=true` };
};

const ButtonContainer = styled.div`
  a:first-of-type {
    margin-right: 8px;
  }
`;
