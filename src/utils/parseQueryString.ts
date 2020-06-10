import queryString from "query-string";

export const parseQueryString = (search: string) =>
  queryString.parse(search, { arrayFormat: "comma" });
