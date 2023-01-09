import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { conditionalToArray } from "utils/array";
import {
  parseQueryStringAsValue as parseQueryString,
  stringifyQueryAsValue as stringifyQuery,
} from "utils/queryString";

/** `useQueryParams` returns all of the query params passed into the url */
const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setQueryString = useCallback(
    (params: { [key: string]: any }) => {
      const stringifiedQuery = stringifyQuery(params);
      setSearchParams(new URLSearchParams(stringifiedQuery), { replace: true });
    },
    [setSearchParams]
  );

  return [parseQueryString(searchParams.toString()), setQueryString] as const;
};

/**
 * `useQueryParam` allows you to interact with a query param in the same way you would use a useState hook.
 *  The first argument is the name of the query param. The second argument is the fallback value of the query param.
 *  `useQueryParam` will default to the second argument if the query param is not present in the url.
 */
const useQueryParam = <T>(
  param: string,
  defaultParam: T
): readonly [T, (set: T) => void] => {
  const [searchParams, setSearchParams] = useQueryParams();

  const setQueryParam = useCallback(
    (value: T) => {
      setSearchParams({
        ...searchParams,
        [param]: value,
      });
    },
    [setSearchParams, searchParams, param]
  );

  const queryParam =
    searchParams[param] !== undefined
      ? (conditionalToArray(
          searchParams[param],
          Array.isArray(defaultParam)
        ) as unknown as T)
      : defaultParam;

  return [queryParam, setQueryParam] as const;
};

export { useQueryParams, useQueryParam };
