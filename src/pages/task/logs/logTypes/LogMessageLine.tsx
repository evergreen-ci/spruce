import React from "react";
import { LogMessage } from "gql/queries/get-task-logs";
import { getLogLineWrapper } from "pages/task/logs/logTypes/logMessageLine/LogLines";
import { format } from "date-fns";
const FORMAT_STR = "yyyy/MM/d, HH:mm:ss.SSS";

export const LogMessageLine: React.FC<LogMessage> = ({
  timestamp,
  severity,
  message
}) => {
  const time = timestamp ? `[${format(new Date(timestamp), FORMAT_STR)}] ` : "";
  const LogLineWrapper = getLogLineWrapper(severity);
  return (
    <LogLineWrapper>
      <span className="cy-log-message-time">{time}</span>
      {message}
    </LogLineWrapper>
  );
};
