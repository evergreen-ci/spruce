import queryString, { StringifyOptions } from "query-string";

export const stringifyQuery = (object: { [key: string]: any }) =>
  queryString.stringify(object, {
    arrayFormat: "comma",
  });

export const stringifyQueryAsValue = (
  object: { [key: string]: any },
  options: StringifyOptions = {},
) =>
  queryString.stringify(object, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
    ...options,
  });
