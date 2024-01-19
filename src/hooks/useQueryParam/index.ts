import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { conditionalToArray } from "utils/array";
import {
  parseQueryStringAsValue as parseQueryString,
  stringifyQueryAsValue as stringifyQuery,
} from "utils/queryString";

/**
 * `useQueryParams` returns all of the query params passed into the url and a function to update them.
 * @example const [queryParams, setQueryParams] = useQueryParams();
 *  const { page, limit } = queryParams;
 *  setQueryParams({ page: "0", limit: "10" });
 * @returns - an array with the following properties:
 * `parsedQueryString` - an object with all of the query params passed into the url
 * `setQueryString` - a function that updates the query params in the url
 */
const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setQueryString = useCallback(
    (params: { [key: string]: any }) => {
      const stringifiedQuery = stringifyQuery(params, {
        skipEmptyString: false,
      });
      setSearchParams(new URLSearchParams(stringifiedQuery), { replace: true });
    },
    [setSearchParams],
  );

  const parsedQueryString = useMemo(
    () => parseQueryString(searchParams.toString()),
    [searchParams],
  );
  return [parsedQueryString, setQueryString] as const;
};

/**
 * `useQueryParam` allows you to interact with a query param in the same way you would use a useState hook.
 *  The first argument is the name of the query param. The second argument is the fallback value of the query param.
 *  `useQueryParam` will default to the second argument if the query param is not present in the url.
 * @param param - the name of the query param
 * @param defaultParam - the fallback value of the query param
 * @returns - an array with the following properties:
 * `queryParam` - the value of the query param
 * `setQueryParam` - a function that updates the query param
 * @example const [page, setPage] = useQueryParam("page", 0);
 * console.log(page); // 0
 * setPage(1);
 * console.log(page); // 1
 * @example const [search, setSearch] = useQueryParam("search", "word");
 * console.log(search); // "word
 * setSearch("something else");
 * console.log(search); // "something else"
 */
const useQueryParam = <T>(
  param: string,
  defaultParam: T,
): readonly [T, (set: T) => void] => {
  const [searchParams, setSearchParams] = useQueryParams();

  const setQueryParam = useCallback(
    (value: T) => {
      setSearchParams({
        ...searchParams,
        [param]: value,
      });
    },
    [setSearchParams, searchParams, param],
  );

  const queryParam =
    searchParams[param] !== undefined
      ? (conditionalToArray(
          searchParams[param],
          Array.isArray(defaultParam),
        ) as unknown as T)
      : defaultParam;

  return [queryParam, setQueryParam] as const;
};

export { useQueryParams, useQueryParam };
