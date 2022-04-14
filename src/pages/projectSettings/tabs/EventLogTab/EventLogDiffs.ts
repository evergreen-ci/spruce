import { diff } from "deep-object-diff";
import { ProjectEventSettings, RepoEventSettings } from "gql/generated/types";
import { Subset } from "types/utils";
import { string } from "utils";

const { omitTypename } = string;

const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);

const addDelimiter = (a: string, b: string) => (a ? `${a}.${b}` : b);

const getDiffProperties = (eventObj: object) => {
  const paths = (obj = {}, head = "") =>
    Object.entries(obj).reduce((event, [key, value]) => {
      const fullPath = addDelimiter(head, key);

      return isObject(value)
        ? event.concat(paths(value, fullPath))
        : event.concat(fullPath);
    }, []);

  return paths(eventObj);
};

const formatArrayElements = (eventKey: string) =>
  eventKey.replace(/.[0-9]./g, (x) => `[${x[1]}].`);

const getNestedObject = (nestedObj: object, pathArr: string[]) =>
  pathArr.reduce(
    (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
    nestedObj
  );

export type EventDiffLine = {
  key: string;
  before: string;
  after: string;
};

export const getEventDiffLines = (
  before: Subset<ProjectEventSettings> | Subset<RepoEventSettings>,
  after: Subset<ProjectEventSettings> | Subset<RepoEventSettings>
): EventDiffLine[] => {
  const eventDiff = omitTypename(diff(before, after));
  const pathKeys = getDiffProperties(eventDiff);

  const eventDiffLines = pathKeys.map((key) => {
    const pathsArray = key.split(".");
    const previousValue = getNestedObject(before, pathsArray);
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
