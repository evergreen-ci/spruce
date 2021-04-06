import queryString from "query-string";
import { PAGE_SIZES, getDefaultPageSize } from "components/PageSizeSelector";

const arrayFormat = "comma";
const pageKey = "page";
const limitKey = "limit";

export const getPageFromSearch = (search: string): number => {
  const parsed = queryString.parse(search, { arrayFormat });
  const page = parseInt((parsed[pageKey] ?? "").toString(), 10);
  return !Number.isNaN(page) && page >= 0 ? page : 0;
};

export const getLimitFromSearch = (search: string): number => {
  const parsed = queryString.parse(search, { arrayFormat });
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

export { updateUrlQueryParam } from "./updateUrlQueryParam";
