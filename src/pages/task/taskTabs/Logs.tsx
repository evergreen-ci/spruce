import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import {
  getLobsterTaskLink,
  getParsleyTaskLogLink,
} from "constants/externalResources";
import { size } from "constants/tokens";
import { TaskLogLinks } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks";
import { LogTypes, QueryParams } from "types/task";
import { isProduction } from "utils/environmentalVariables";
import {
  EventLog,
  AgentLog,
  SystemLog,
  TaskLog,
  AllLog,
} from "./logs/LogTypes";

const DEFAULT_LOG_TYPE = LogTypes.Task;

const options = {
  [LogTypes.Agent]: AgentLog,
  [LogTypes.System]: SystemLog,
  [LogTypes.Task]: TaskLog,
  [LogTypes.Event]: EventLog,
  [LogTypes.All]: AllLog,
};

interface Props {
  logLinks: TaskLogLinks;
  taskId: string;
  execution: number;
}
export const Logs: React.VFC<Props> = ({ logLinks, taskId, execution }) => {
  const { search } = useLocation();
  const parsed = queryString.parse(search);
  const logTypeParam = (parsed[QueryParams.LogType] || "")
    .toString()
    .toLowerCase();

  const [currentLog, setCurrentLog] = useState<LogTypes>(
    (logTypeParam as LogTypes) ?? DEFAULT_LOG_TYPE
  );
  const [noLogs, setNoLogs] = useState(false);
  const { sendEvent } = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();

  const onChangeLog = (value: string): void => {
    const nextLogType = value as LogTypes;
    setCurrentLog(nextLogType);
    updateQueryParams({ [QueryParams.LogType]: nextLogType });
    sendEvent({
      name: "Select Logs Type",
      logsType: nextLogType,
    });
  };

  const { htmlLink, rawLink, lobsterLink } = getLinks(
    logLinks,
    currentLog,
    taskId,
    execution
  );
  const LogComp = options[currentLog];

  return (
    <>
      <LogHeader>
        <SegmentedControl
          aria-controls="Select a log type"
          name="log-select"
          onChange={onChangeLog}
          value={currentLog}
          label="Log Tail"
        >
          <SegmentedControlOption
            data-cy="task-option"
            id="cy-task-option"
            value={LogTypes.Task}
          >
            Task Logs
          </SegmentedControlOption>
          <SegmentedControlOption
            data-cy="agent-option"
            id="cy-agent-option"
            value={LogTypes.Agent}
          >
            Agent Logs
          </SegmentedControlOption>
          <SegmentedControlOption
            data-cy="system-option"
            id="cy-system-option"
            value={LogTypes.System}
          >
            System Logs
          </SegmentedControlOption>
          <SegmentedControlOption
            data-cy="event-option"
            id="cy-event-option"
            value={LogTypes.Event}
          >
            Event Logs
          </SegmentedControlOption>
          <SegmentedControlOption
            data-cy="all-option"
            id="cy-all-option"
            value={LogTypes.All}
          >
            All Logs
          </SegmentedControlOption>
        </SegmentedControl>

        {(htmlLink || rawLink || lobsterLink) && (
          <ButtonContainer>
            {rawLink && (
              <Button
                data-cy="lobster-log-btn"
                disabled={noLogs}
                href={lobsterLink}
                target="_blank"
                onClick={() => sendEvent({ name: "Click Logs Lobster Button" })}
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
                onClick={() => sendEvent({ name: "Click Logs HTML Button" })}
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
                onClick={() => sendEvent({ name: "Click Logs Raw Button" })}
              >
                Raw
              </Button>
            )}
          </ButtonContainer>
        )}
      </LogHeader>
      {LogComp && (
        <LogComp
          htmlLink={htmlLink}
          rawLink={rawLink}
          lobsterLink={lobsterLink}
          currentLog={currentLog}
          setNoLogs={setNoLogs}
        />
      )}
    </>
  );
};

const LogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.s};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
  margin-right: ${size.xxs};
`;

interface GetLinksResult {
  htmlLink?: string;
  lobsterLink?: string;
  rawLink?: string;
}

const getLinks = (
  logLinks: TaskLogLinks,
  logType: LogTypes,
  taskId: string,
  execution: number
): GetLinksResult => {
  if (!logLinks) {
    return {};
  }
  if (logType === LogTypes.Event) {
    return { htmlLink: logLinks.eventLogLink };
  }
  const htmlLink = `${
    {
      [LogTypes.Agent]: logLinks.agentLogLink,
      [LogTypes.System]: logLinks.systemLogLink,
      [LogTypes.Task]: logLinks.taskLogLink,
      [LogTypes.All]: logLinks.allLogLink,
    }[logType] ?? ""
  }`;
  return {
    htmlLink,
    lobsterLink: isProduction()
      ? getLobsterTaskLink(logType, taskId, execution)
      : getParsleyTaskLogLink(logType, taskId, execution),
    rawLink: `${htmlLink}&text=true`,
  };
};
