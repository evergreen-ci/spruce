import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { getLobsterTaskLink } from "constants/externalResources";
import { TaskLogLinks } from "gql/generated/types";
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
export const Logs: React.FC<Props> = ({ logLinks, taskId, execution }) => {
  const { search } = useLocation();
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
      logTypeParam === LogTypes.Task ||
      logTypeParam === LogTypes.All
    ) {
      setCurrentLog(logTypeParam);
    } else {
      setCurrentLog(DEFAULT_LOG_TYPE);
    }
  }, [logTypeParam]);

  const { htmlLink, rawLink, lobsterLink } = getLinks(
    logLinks,
    currentLog,
    taskId,
    execution
  );
  const LogComp = options[currentLog];
  return (
    LogComp && (
      <LogComp
        htmlLink={htmlLink}
        rawLink={rawLink}
        lobsterLink={lobsterLink}
        currentLog={currentLog}
      />
    )
  );
};

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
    lobsterLink: getLobsterTaskLink(logType, taskId, execution),
    rawLink: `${htmlLink}&text=true`,
  };
};
