import React from "react";
import { LogMessage } from "gql/queries/get-task-logs";
import { getLogLineWrapper } from "pages/task/logs/logMessageLine/LogLines";
import { format } from "date-fns";
const FORMAT_STR = "yyyy/mm/d, HH:mm:ss.SSS";

export const LogMessageLine: React.FC<LogMessage> = props => {
  const { timestamp, severity, message } = props;
  const time = timestamp ? `[${format(new Date(timestamp), FORMAT_STR)}] ` : "";
  const LogLineWrapper = getLogLineWrapper(severity);
  return (
    <LogLineWrapper>
      {time}
      {message}
    </LogLineWrapper>
  );
};
