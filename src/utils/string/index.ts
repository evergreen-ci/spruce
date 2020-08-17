import { format } from "date-fns";
import get from "lodash/get";
import { useQuery } from "@apollo/react-hooks";
import { GetUserSettingsQuery } from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";
import { formatToTimeZone } from "date-fns-timezone";

// get the timezone for the user
export const useUserTimeZone = () => {
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );
  return get(userSettingsData, "userSettings.timezone", "");
};

// shortenString takes a string and shortens it
// Useful for displaying part of a long string, such as a long taskId
export const shortenString = (
  value: string,
  wordwise: boolean,
  max: number,
  tail: string
): string => {
  if (!value) {
    return "";
  }

  if (!max) {
    return value;
  }
  if (value.length <= max) {
    return value;
  }

  let valueSubstring = value.substr(0, max);
  if (wordwise) {
    const lastspace = valueSubstring.lastIndexOf(" ");
    if (lastspace !== -1) {
      valueSubstring = valueSubstring.substr(0, lastspace);
    }
  }

  return valueSubstring + (tail || " …");
};

export const msToDuration = (ms: number): string => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysMilli = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysMilli / (60 * 60 * 1000));
  const hoursMilli = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursMilli / (60 * 1000));
  const minutesMilli = ms % (60 * 1000);
  const seconds = Math.floor(minutesMilli / 1000);
  const milliseconds = ms % 1000;
  if (days > 1) {
    return `${Math.trunc(days)}d ${hours}h ${minutes}m ${seconds}s`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  if (seconds > 0) {
    return `${seconds}s ${milliseconds}ms`;
  }
  return `${milliseconds}ms`;
};

export const stringifyNanoseconds = (input, skipDayMax, skipSecMax) => {
  const NS_PER_MS = 1000 * 1000; // 10^6
  const NS_PER_SEC = NS_PER_MS * 1000;
  const NS_PER_MINUTE = NS_PER_SEC * 60;
  const NS_PER_HOUR = NS_PER_MINUTE * 60;

  if (input === 0) {
    return "0 seconds";
  }
  if (input < NS_PER_MS) {
    return "< 1 ms";
  }
  if (input < NS_PER_SEC) {
    if (skipSecMax) {
      return `${Math.floor(input / NS_PER_MS)} ms`;
    }
    return "< 1 second";
  }
  if (input < NS_PER_MINUTE) {
    return `${Math.floor(input / NS_PER_SEC)} seconds`;
  }
  if (input < NS_PER_HOUR) {
    return `${Math.floor(input / NS_PER_MINUTE)}m ${Math.floor(
      (input % NS_PER_MINUTE) / NS_PER_SEC
    )}s`;
  }
  if (input < NS_PER_HOUR * 24 || skipDayMax) {
    return `${Math.floor(input / NS_PER_HOUR)}h ${Math.floor(
      (input % NS_PER_HOUR) / NS_PER_MINUTE
    )}m ${Math.floor((input % NS_PER_MINUTE) / NS_PER_SEC)}s`;
  }
  if (input === "unknown") {
    return "unknown";
  }
  return ">= 1 day";
};

export const omitTypename = (object) =>
  JSON.parse(JSON.stringify(object), (key, value) =>
    key === "__typename" ? undefined : value
  );

// const DATE_FORMAT = "MMM d, yyyy, h:mm:ss aaaaa'm";
// export const getDateCopy = (d: Date): string =>
//   d ? format(new Date(d), DATE_FORMAT) : "";

export const getDateCopy = (time, timeZone?) => {
  if (timeZone) {
    return formatToTimeZone(time, "MMM D, YYYY h:mm:ss a", {
      // eslint-disable-next-line object-shorthand
      timeZone: timeZone,
    });
  }
  if (time) {
    return format(new Date(time), "MMM d, yyyy, h:mm:ss aaaaa'm");
  }
  return "";
};
