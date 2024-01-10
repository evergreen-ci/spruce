import {
  PAGE_SIZES,
  DEFAULT_PAGE_SIZE,
  RECENT_PAGE_SIZE_KEY,
} from "constants/index";
import { parseQueryString } from "utils/queryString";

const pageKey = "page";
const limitKey = "limit";

export const getPageFromSearch = (search: string): number => {
  const parsed = parseQueryString(search);
  const page = parseInt((parsed[pageKey] ?? "").toString(), 10);
  return !Number.isNaN(page) && page >= 0 ? page : 0;
};

export const getLimitFromSearch = (search: string): number => {
  const parsed = parseQueryString(search);
  const limit = parseInt((parsed[limitKey] ?? "").toString(), 10);
  return !Number.isNaN(limit) && PAGE_SIZES.includes(limit)
    ? limit
    : getDefaultPageSize();
};

// Takes a query param and a value and returns an array
// if the query param already contains the value it does not modify it otherwise
// it will add the value to the query param
export const upsertQueryParam = (params: string[] | string, value: string) => {
  if (
    params === undefined ||
    (typeof params === "string" && params === value)
  ) {
    return [value];
  }
  if (Array.isArray(params) && params.find((param) => param === value)) {
    return [...params];
  }
  return Array.isArray(params) ? [...params, value] : [params, value];
};

// Takes a query param and returns the param WITHOUT the specified value
export const removeQueryParam = (param: string | string[], value: string) => {
  if (Array.isArray(param)) {
    return param.filter((p) => p !== value);
  }
  return undefined;
};

export const getDefaultPageSize = () => {
  const pageSizeFromLocalStorage: number = parseInt(
    localStorage.getItem(RECENT_PAGE_SIZE_KEY),
    10,
  );

  return PAGE_SIZES.includes(pageSizeFromLocalStorage)
    ? pageSizeFromLocalStorage
    : DEFAULT_PAGE_SIZE;
};

export * from "./updateUrlQueryParam";
