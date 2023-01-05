import { stringify } from "query-string";

export const stringifyQuery = (object: { [key: string]: any }) =>
  stringify(object, {
    arrayFormat: "comma",
  });

export const stringifyQueryAsValue = (object: { [key: string]: any }) =>
  stringify(object, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });
