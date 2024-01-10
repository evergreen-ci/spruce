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
export const Logs: React.FC<Props> = ({ execution, logLinks, taskId }) => {
  const { sendEvent } = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const parsed = queryString.parse(search);
  const logTypeParam = (parsed[QueryParams.LogType] || "")
    .toString()
    .toLowerCase() as LogTypes;

  const [currentLog, setCurrentLog] = useState<LogTypes>(
    Object.values(LogTypes).includes(logTypeParam)
      ? logTypeParam
      : DEFAULT_LOG_TYPE,
  );
  const [noLogs, setNoLogs] = useState(false);

  const onChangeLog = (value: string): void => {
    const nextLogType = value as LogTypes;
    setCurrentLog(nextLogType);
    updateQueryParams({ [QueryParams.LogType]: nextLogType });
    sendEvent({
      name: "Select Logs Type",
      logType: nextLogType,
    });
  };

  const { htmlLink, lobsterLink, parsleyLink, rawLink } = getLinks(
    logLinks,
    currentLog,
    taskId,
    execution,
  );
  const LogComp = options[currentLog];

  return (
    <>
      <LogHeader>
        <SegmentedControl
          aria-controls="Select a log type"
          label="Log Tail"
          name="log-select"
          onChange={onChangeLog}
          value={currentLog}
        >
          <SegmentedControlOption id="cy-task-option" value={LogTypes.Task}>
            Task Logs
          </SegmentedControlOption>
          <SegmentedControlOption id="cy-agent-option" value={LogTypes.Agent}>
            Agent Logs
          </SegmentedControlOption>
          <SegmentedControlOption id="cy-system-option" value={LogTypes.System}>
            System Logs
          </SegmentedControlOption>
          <SegmentedControlOption id="cy-event-option" value={LogTypes.Event}>
            Event Logs
          </SegmentedControlOption>
          <SegmentedControlOption id="cy-all-option" value={LogTypes.All}>
            All Logs
          </SegmentedControlOption>
        </SegmentedControl>

        {(htmlLink || rawLink || parsleyLink || lobsterLink) && (
          <ButtonContainer>
            {parsleyLink && (
              <Button
                title="High-powered log viewer"
                data-cy="parsley-log-btn"
                disabled={noLogs}
                href={parsleyLink}
                target="_blank"
                onClick={() =>
                  sendEvent({
                    name: "Click Logs Button",
                    logType: currentLog,
                    logViewer: "parsley",
                  })
                }
              >
                Parsley
              </Button>
            )}
            {lobsterLink && (
              <Button
                title="Legacy log viewer"
                data-cy="lobster-log-btn"
                disabled={noLogs}
                href={lobsterLink}
                target="_blank"
                onClick={() =>
                  sendEvent({
                    name: "Click Logs Button",
                    logType: currentLog,
                    logViewer: "lobster",
                  })
                }
              >
                Lobster
              </Button>
            )}
            {htmlLink && (
              <Button
                title="Plain, colorized log viewer"
                data-cy="html-log-btn"
                disabled={noLogs}
                href={htmlLink}
                target="_blank"
                onClick={() =>
                  sendEvent({
                    name: "Click Logs Button",
                    logType: currentLog,
                    logViewer: "html",
                  })
                }
              >
                HTML
              </Button>
            )}
            {rawLink && (
              <Button
                title="Plain text log viewer"
                data-cy="raw-log-btn"
                disabled={noLogs}
                href={rawLink}
                target="_blank"
                onClick={() =>
                  sendEvent({
                    name: "Click Logs Button",
                    logType: currentLog,
                    logViewer: "raw",
                  })
                }
              >
                Raw
              </Button>
            )}
          </ButtonContainer>
        )}
      </LogHeader>
      {LogComp && <LogComp setNoLogs={setNoLogs} />}
    </>
  );
};

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.s};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

interface GetLinksResult {
  htmlLink?: string;
  parsleyLink?: string;
  rawLink?: string;
  lobsterLink?: string;
}

const getLinks = (
  logLinks: TaskLogLinks,
  logType: LogTypes,
  taskId: string,
  execution: number,
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
    parsleyLink: getParsleyTaskLogLink(logType, taskId, execution),
    lobsterLink: getLobsterTaskLink(logType, taskId, execution),
    rawLink: `${htmlLink}&text=true`,
  };
};
