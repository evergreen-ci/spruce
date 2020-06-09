import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import {
  EventLog,
  AgentLog,
  SystemLog,
  TaskLog,
  LogTypes,
  QueryParams,
} from "pages/task/logs/LogTypes";
import Maybe from "graphql/tsutils/Maybe";

const DEFAULT_LOG_TYPE = LogTypes.Task;

const options = {
  [LogTypes.Agent]: AgentLog,
  [LogTypes.System]: SystemLog,
  [LogTypes.Task]: TaskLog,
  [LogTypes.Event]: EventLog,
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

  const { htmlLink, rawLink } = getLinks(logLinks, currentLog);
  const LogComp = options[currentLog];
  return LogComp ? (
    <LogComp htmlLink={htmlLink} rawLink={rawLink} currentLog={currentLog} />
  ) : (
    <></>
  );
};

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
