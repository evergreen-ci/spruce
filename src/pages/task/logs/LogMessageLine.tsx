import React from "react";
import { LogMessage } from "gql/queries/get-task-logs";
import { getLogLineWrapper } from "components/styles/LogLines";

export const LogMessageLine: React.FC<LogMessage> = props => {
  const { timestamp, severity, message } = props;
  let time = "";
  if (timestamp) {
    const d = new Date(timestamp);
    // formats time YYYY/MM/DD HH:MM:SS.MS
    time = `[${d.getFullYear()}/${d.getMonth() +
      1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}}] `;
  }
  const LogLineWrapper = getLogLineWrapper(severity);
  return (
    <LogLineWrapper>
      {time}
      {message}
    </LogLineWrapper>
  );
};
