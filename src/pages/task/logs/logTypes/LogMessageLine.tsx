import React from "react";
import { LogMessage } from "gql/generated/types";
import { getLogLineWrapper } from "pages/task/logs/logTypes/logMessageLine/LogLines";
import { format } from "date-fns";
import linkifyHtml from "linkifyjs/html";
var Convert = require("ansi-to-html");
var convert = new Convert({ newline: true, escapeXML: true });

const FORMAT_STR = "yyyy/MM/d, HH:mm:ss.SSS";

export const LogMessageLine: React.FC<LogMessage> = ({
  timestamp,
  severity,
  message,
}) => {
  const time = timestamp ? `[${format(new Date(timestamp), FORMAT_STR)}] ` : "";
  const LogLineWrapper = getLogLineWrapper(severity);
  return (
    <LogLineWrapper>
      <span className="cy-log-message-time">{time}</span>
      <span
        dangerouslySetInnerHTML={{
          __html: linkifyHtml(convert.toHtml(message), {
            validate: {
              url: (value) => /^(http)s?:\/\//.test(value),
            },
          }),
        }}
      />
    </LogLineWrapper>
  );
};
