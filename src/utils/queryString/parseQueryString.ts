import queryString from "query-string";

export const parseQueryString = (search: string) =>
  queryString.parse(search, { arrayFormat: "comma" });

export const getString = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;

export const getArray = (param: string | string[]): string[] =>
  Array.isArray(param) ? param : [param];
