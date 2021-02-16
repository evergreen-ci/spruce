import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { getLobsterTaskLink } from "constants/routes";
import {
  EventLog,
  AgentLog,
  SystemLog,
  TaskLog,
  LogTypes,
  QueryParams,
} from "./logs/LogTypes";

const DEFAULT_LOG_TYPE = LogTypes.Task;

const options = {
  [LogTypes.Agent]: AgentLog,
  [LogTypes.System]: SystemLog,
  [LogTypes.Task]: TaskLog,
  [LogTypes.Event]: EventLog,
};

interface LogLinks {
  allLogLink?: string;
  agentLogLink?: string;
  systemLogLink?: string;
  taskLogLink?: string;
  eventLogLink?: string;
}

interface Props {
  logLinks: LogLinks;
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
      logTypeParam === LogTypes.Task
    ) {
      setCurrentLog(logTypeParam);
    } else {
      setCurrentLog(DEFAULT_LOG_TYPE);
    }
  }, [logTypeParam]);

  const { htmlLink, rawLink } = getLinks(
    logLinks,
    currentLog,
    taskId,
    execution
  );
  const LogComp = options[currentLog];
  return (
    LogComp && (
      <LogComp htmlLink={htmlLink} rawLink={rawLink} currentLog={currentLog} />
    )
  );
};

interface GetLinksResult {
  htmlLink?: string;
  rawLink?: string;
}

const getLinks = (
  logLinks: LogLinks,
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
  return {
    htmlLink: getLobsterTaskLink(logType, taskId, execution),
    rawLink: `${
      {
        [LogTypes.Agent]: logLinks.agentLogLink,
        [LogTypes.System]: logLinks.systemLogLink,
        [LogTypes.Task]: logLinks.taskLogLink,
      }[logType] ?? ""
    }&text=true`,
  };
};
