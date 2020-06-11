import queryString from "query-string";

export const stringifyQuery = (object: { [key: string]: any }) =>
  queryString.stringify(object, { arrayFormat: "comma" });
