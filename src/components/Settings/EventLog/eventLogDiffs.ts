import { diff } from "deep-object-diff";
import { string } from "utils";
import { Event, EventDiffLine, EventValue } from "./types";

const { omitTypename } = string;

const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);

const addDelimiter = (a: string, b: string): string => (a ? `${a}.${b}` : b);

const getDiffProperties = (eventObj: object): string[] => {
  const paths = (obj = {}, head = "") =>
    Object.entries(obj).reduce((event, [key, value]) => {
      const fullPath = addDelimiter(head, key);

      return isObject(value)
        ? event.concat(paths(value, fullPath))
        : event.concat(fullPath);
    }, []);
  return paths(eventObj);
};

const formatArrayElements = (eventKey: string): string =>
  eventKey.replace(/.[0-9]./g, (x) => `[${x[1]}].`);

const getNestedObject = (nestedObj: object, pathArr: string[]): EventValue =>
  pathArr.reduce((obj, key) => (obj ? obj[key] : undefined), nestedObj);

export const getEventDiffLines = (
  before: Event["before"],
  after: Event["after"]
): EventDiffLine[] => {
  const beforeNoTypename = omitTypename(before);
  const afterNoTypename = omitTypename(after);
  const eventDiff = diff(beforeNoTypename, afterNoTypename);
  const pathKeys: string[] = getDiffProperties(eventDiff);

  const eventDiffLines = pathKeys.map((key) => {
    const pathsArray = key.split(".");
    const previousValue = getNestedObject(beforeNoTypename, pathsArray);
    const changedValue = getNestedObject(eventDiff, pathsArray);

    const formattedKey = formatArrayElements(key);

    const line = {
      key: formattedKey,
      before: previousValue,
      after: changedValue,
    };

    return line;
  });

  return eventDiffLines.filter((el) => el !== null);
};
