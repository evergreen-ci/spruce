import { useMemo } from "react";
import AnsiUp from "ansi_up";
import { format } from "date-fns";
import parse from "html-react-parser";
import linkifyHtml from "linkifyjs/html";
import { LogMessageFragment } from "gql/generated/types";
import { getLogLineWrapper } from "./logMessageLine/LogLines";

const FORMAT_STR = "yyyy/MM/d, HH:mm:ss.SSS";
const ansiUp = new AnsiUp();

export const LogMessageLine: React.VFC<LogMessageFragment> = ({
  timestamp,
  severity,
  message,
}) => {
  const time = timestamp ? `[${format(new Date(timestamp), FORMAT_STR)}] ` : "";
  const LogLineWrapper = getLogLineWrapper(severity);
  const memoizedLogLine = useMemo(() => {
    const render = linkifyHtml(ansiUp.ansi_to_html(message), {
      validate: {
        url: (value) => /^(http)s?:\/\//.test(value),
      },
    });
    return parse(render);
  }, [message]);
  return (
    <LogLineWrapper>
      <span className="cy-log-message-time">{time}</span>
      {memoizedLogLine}
    </LogLineWrapper>
  );
};
