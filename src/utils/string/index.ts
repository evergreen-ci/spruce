import { format } from "date-fns";
import get from "lodash.get";

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

export const omitTypename = (object) =>
  JSON.parse(JSON.stringify(object), (key, value) =>
    key === "__typename" ? undefined : value
  );

const DATE_FORMAT = "MMM d, yyyy, h:mm:ss aaaa";
export const getDateCopy = (d: Date): string =>
  d ? format(new Date(d), DATE_FORMAT) : "";

export const copyToClipboard = (str: string) => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
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
