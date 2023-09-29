import { useMemo } from "react";
import { AnsiUp } from "ansi_up";
import { format, utcToZonedTime } from "date-fns-tz";
import parse from "html-react-parser";
import linkifyHtml from "linkify-html";
import { LogMessageFragment } from "gql/generated/types";
import { useUserTimeZone } from "hooks";
import { getLogLineWrapper } from "./logMessageLine/LogLines";

const FORMAT_STR = "yyyy/MM/dd HH:mm:ss.SSS";
const ansiUp = new AnsiUp();

export const LogMessageLine: React.FC<LogMessageFragment> = ({
  message,
  severity,
  timestamp,
}) => {
  const tz = useUserTimeZone();
  const time = timestamp
    ? `[${format(new Date(utcToZonedTime(timestamp, tz)), FORMAT_STR, {
        timeZone: tz,
      })}] `
    : "";
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
