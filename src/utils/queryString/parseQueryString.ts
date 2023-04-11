import queryString from "query-string";

interface ParseQueryString {
  [key: string]: string | string[];
}
export const parseQueryString = (search: string): ParseQueryString =>
  queryString.parse(search, { arrayFormat: "comma" });

export const parseQueryStringAsValue = (search: string) =>
  queryString.parse(search, {
    arrayFormat: "comma",
    parseBooleans: true,
    parseNumbers: true,
  });

export const getString = (param: string | string[] = ""): string =>
  Array.isArray(param) ? param[0] : param;

export const queryParamAsNumber = (str: string | string[]) =>
  !Number.isNaN(Number(str)) ? Number(str) : null;
