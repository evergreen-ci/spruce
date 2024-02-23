import { format, utcToZonedTime } from "date-fns-tz";
import get from "lodash/get";

export { githubPRLinkify } from "./githubPRLinkify";

/**
 * `msToDuration` converts a number of milliseconds to a string representing the duration
 * @param ms - milliseconds
 * @returns - a string representing the duration in the format of "1d 2h 3m 4s"
 */
export const msToDuration = (ms: number): string => {
  if (ms === 0) {
    return "0s";
  }
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysMilli = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysMilli / (60 * 60 * 1000));
  const hoursMilli = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursMilli / (60 * 1000));
  const minutesMilli = ms % (60 * 1000);
  const seconds = Math.floor(minutesMilli / 1000);
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
    return `${seconds}s`;
  }
  return `${ms}ms`;
};

/**
 * `stringifyNanoseconds` converts a number of nanoseconds to a string representing the duration
 * @param input - nanoseconds
 * @param skipDayMax - if true, will not display days if the duration is greater than 24 hours
 * @param skipSecMax - if true, will not display seconds if the duration is greater than 60 seconds
 * @returns - a string representing the duration in the format of "1d 2h 3m 4s"
 * @example
 * stringifyNanoseconds(1000000000000) // "11 days"
 * stringifyNanoseconds(1000000000000, true) // "11 days"
 */
export const stringifyNanoseconds = (
  input: number,
  skipDayMax: boolean,
  skipSecMax: boolean,
) => {
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
      (input % NS_PER_MINUTE) / NS_PER_SEC,
    )}s`;
  }
  if (input < NS_PER_HOUR * 24 || skipDayMax) {
    return `${Math.floor(input / NS_PER_HOUR)}h ${Math.floor(
      (input % NS_PER_HOUR) / NS_PER_MINUTE,
    )}m ${Math.floor((input % NS_PER_MINUTE) / NS_PER_SEC)}s`;
  }
  return ">= 1 day";
};

/**
 * `omitTypename` removes the __typename property from an object
 * @param object - the object to remove the __typename property from
 * @returns - the object without the __typename property
 * @example
 * omitTypename({ __typename: "Task", id: "123" }) // { id: "123" }
 */
export const omitTypename = (object) =>
  JSON.parse(JSON.stringify(object), (key, value) =>
    key === "__typename" ? undefined : value,
  );

export type DateCopyOptions = {
  tz?: string;
  dateOnly?: boolean;
  omitSeconds?: boolean;
  omitTimezone?: boolean;
  dateFormat?: string;
  timeFormat?: string;
};

/**
 * `getDateCopy` converts a date to a string in the format of "MMM d, yyyy h:mm:ss a z"
 * @param time - a string, number, or Date object
 * @param options - an object with options for formatting the date
 * @param options.tz - a timezone string, such as "America/Los_Angeles"
 * @param options.dateOnly - if true, will only return the date, not the time
 * @param options.omitSeconds - if true, will not return the seconds
 * @param options.omitTimezone - if true, will not return the timezone
 * @param options.dateFormat - a date format string, such as "MMM d, yyyy"
 * @returns - a string representing the date in either the user's specified format or the default, "MMM d, yyyy h:mm:ss aa z"
 */
export const getDateCopy = (
  time: string | number | Date,
  options?: DateCopyOptions,
) => {
  if (!time) {
    return "";
  }
  const { dateOnly, omitSeconds, omitTimezone, tz } = options || {};
  let { dateFormat, timeFormat } = options || {};
  if (!dateFormat) {
    dateFormat = "MMM d, yyyy";
  }
  if (!timeFormat) {
    timeFormat = "h:mm:ss aa";
  }
  if (omitSeconds) {
    timeFormat = timeFormat.replace(":ss", "");
  }
  const finalDateFormat = dateOnly
    ? dateFormat
    : `${dateFormat}, ${timeFormat}${omitTimezone ? "" : " z"}`;
  if (tz) {
    return format(utcToZonedTime(time, tz), finalDateFormat, {
      timeZone: tz,
    });
  }

  return format(new Date(time), finalDateFormat);
};

/**
 * `copyToClipboard` copies a string to the clipboard
 * @param textToCopy - the string to copy to the clipboard
 */
export const copyToClipboard = (textToCopy: string) => {
  navigator.clipboard.writeText(textToCopy);
};

/**
 * `sortFunctionString` is a helper function for sorting an array of objects by a string key
 * @param a - the first object to compare
 * @param b - the second object to compare
 * @param key - the key to sort by
 * @returns - a number representing the sort order
 * @example
 * const arr = [{ name: "b" }, { name: "a" }];
 * arr.sort((a, b) => sortFunctionString(a, b, "name"));
 * // [{ name: "a" }, { name: "b" }]
 */
export const sortFunctionString = <T>(a: T, b: T, key: string) => {
  const nameA = get(a, key).toUpperCase();
  const nameB = get(b, key).toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

/**
 * `sortFunctionDate` is a helper function for sorting an array of objects by a date key
 * @param a - the first object to compare
 * @param b - the second object to compare
 * @param key - the key to sort by
 * @returns - a number representing the sort order
 * @example
 * const arr = [{ date: "2021-01-01" }, { date: "2021-01-02" }];
 * arr.sort((a, b) => sortFunctionDate(a, b, "date"));
 * // [{ date: "2021-01-01" }, { date: "2021-01-02" }]
 */
export const sortFunctionDate = <T>(a: T, b: T, key: string) => {
  let dateA: Date;
  let dateB: Date;
  try {
    dateA = new Date(get(a, key));
    dateB = new Date(get(b, key));
  } catch (e) {
    throw Error(`Could not convert ${key} to date`);
  }
  return dateA.getTime() - dateB.getTime();
};

/**
 * @param  str - A string that does not contain regex operators.
 * @returns A regex that strictly matches on the input.
 */
export const applyStrictRegex = (str: string) => `^${str}$`;

/**
 *
 * @param str - A string that may contain regex operators.
 * @returns A regex that matches on the input.
 */
export const escapeRegex = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * @param str - A string that represents a githash
 * @returns A shortenend version of the input string.
 */
export const shortenGithash = (str: string) => str?.substring(0, 7);

/**
 * Function that trims the middle portion of a string. ex: "EvergreenUI" -> "Ev...UI"
 * The resulting length, if trimmed, is maxLength + 1 (due to ellipsis length).
 * @param str - Text to trim
 * @param maxLength - Max length before trimming text
 * @returns The original or trimmed text.
 */
export const trimStringFromMiddle = (str: string, maxLength: number) => {
  const ellipsis = "…";
  const numCharsToRemove = str.length - maxLength;

  // if ellipsis would make the string longer/same, just return original string
  if (numCharsToRemove <= ellipsis.length) {
    return str;
  }

  const midpoint = Math.floor(str.length / 2);
  const frontOffset = Math.floor(numCharsToRemove / 2);
  const backOffset = Math.ceil(numCharsToRemove / 2);
  return (
    str.substring(0, midpoint - frontOffset) +
    ellipsis +
    str.substring(midpoint + backOffset)
  );
};

/**
 * Convert an array of strings into a string that lists them, separated by commas and with a coordinating conjunction (i.e. "and" or "or") preceding the last word.
 * E.g. joinWithConjunction(["spruce", "app", "plt"], "and") => "spruce, app, and plt"
 * @param array - List of words.
 * @param conjunction - Word such as "and" or "or" that should precede the last list item.
 * @returns List items joined by a comma with the coordinating conjunction
 */
export const joinWithConjunction = (array: string[], conjunction: string) => {
  if (array.length === 0) {
    return "";
  }
  if (array.length === 1) {
    return array[0];
  }
  if (array.length === 2) {
    return `${array[0]} ${conjunction} ${array[1]}`;
  }
  return `${array.slice(0, -1).join(", ")}, ${conjunction} ${array.slice(-1)}`;
};

/**
 * Given a string, strips new line characters.
 * @param str - string to remove new lines from
 * @returns string with new lines removed
 */
export const stripNewLines = (str: string) => str.replace(/\n/g, "");

/**
 * Given a string, converts it to sentence case.
 * @param string - string to convert to sentence case
 * @returns string in sentence case
 * @example
 * toSentenceCase("hello world") => "Hello world"
 * toSentenceCase("HELLO WORLD") => "Hello world"
 */
export const toSentenceCase = (string: string) => {
  if (string === undefined || string.length === 0) {
    return "";
  }
  return string[0].toUpperCase() + string.substring(1).toLowerCase();
};

/**
 * Given a JIRA URL, extract the ticket number.
 * @param jiraURL - the URL from which to extract the ticket number
 * @returns the JIRA ticket number
 */
export const getTicketFromJiraURL = (jiraURL: string) => {
  const ticketNumber = jiraURL.match(/[A-Z]+-[0-9]+/)?.[0];
  return ticketNumber;
};
