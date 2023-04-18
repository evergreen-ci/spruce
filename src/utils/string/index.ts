import { format, utcToZonedTime } from "date-fns-tz";
import get from "lodash/get";

export { githubPRLinkify } from "./githubPRLinkify";

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
};

export const stringifyNanoseconds = (
  input: number,
  skipDayMax: boolean,
  skipSecMax: boolean
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
      (input % NS_PER_MINUTE) / NS_PER_SEC
    )}s`;
  }
  if (input < NS_PER_HOUR * 24 || skipDayMax) {
    return `${Math.floor(input / NS_PER_HOUR)}h ${Math.floor(
      (input % NS_PER_HOUR) / NS_PER_MINUTE
    )}m ${Math.floor((input % NS_PER_MINUTE) / NS_PER_SEC)}s`;
  }
  return ">= 1 day";
};

export const omitTypename = (object) =>
  JSON.parse(JSON.stringify(object), (key, value) =>
    key === "__typename" ? undefined : value
  );

export type DateCopyOptions = {
  tz?: string;
  dateOnly?: boolean;
  omitSeconds?: boolean;
  dateFormat?: string;
};

// Will return a time in the users local timezone when one is not provided
export const getDateCopy = (
  time: string | number | Date,
  options?: DateCopyOptions
) => {
  if (!time) {
    return "";
  }
  const { tz, dateOnly, omitSeconds } = options || {};
  let { dateFormat } = options || {};
  if (!dateFormat) {
    dateFormat = "MMM d, yyyy";
  }
  const finalDateFormat = dateOnly
    ? dateFormat
    : `${dateFormat}, h:mm${omitSeconds ? "" : ":ss"} aa O`;
  if (tz) {
    return format(utcToZonedTime(time, tz), finalDateFormat, {
      timeZone: tz,
    });
  }

  return format(new Date(time), finalDateFormat);
};

export const copyToClipboard = (textToCopy: string) => {
  navigator.clipboard.writeText(textToCopy);
};

export const sortFunctionString = (a, b, key) => {
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

export const sortFunctionDate = (a, b, key) => {
  let dateA;
  let dateB;
  try {
    dateA = new Date(get(a, key));
    dateB = new Date(get(b, key));
  } catch (e) {
    throw Error(`Could not convert ${key} to date`);
  }
  return dateA - dateB;
};

/**
 * @param {string}  str - A string that does not contain regex operators.
 * @return {string} A regex that strictly matches on the input.
 */
export const applyStrictRegex = (str: string) => `^${str}$`;

/**
 *
 * @param str - A string that may contain regex operators.
 * @return {string} A regex that matches on the input.
 */
export const escapeRegex = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * @param str - A string that represents a githash
 * @return {string} A shortenend version of the input string.
 */
export const shortenGithash = (str: string) => str?.substring(0, 7);

/**
 * Function that trims the middle portion of a string. ex: "EvergreenUI" -> "Ev...UI"
 * The resulting length, if trimmed, is maxLength + 1 (due to ellipsis length).
 * @param {string} str - Text to trim
 * @param {number} maxLength - Max length before trimming text
 * @return {string} The original or trimmed text.
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
 * @param {string[]} array - List of words.
 * @param {string} conjunction - Word such as "and" or "or" that should precede the last list item.
 * @return {string} List items joined by a comma with the coordinating conjunction
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
 * @param {string} str - string to remove new lines from
 * @return {string} string with new lines removed
 */
export const stripNewLines = (str: string) => str.replace(/\n/g, "");

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
