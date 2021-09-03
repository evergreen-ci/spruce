import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

export const useUpdateURLQueryParams = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const result = useMemo(
    () => (nextQueryParams: StringMap) =>
      replace(
        `${pathname}?${stringifyQuery({
          ...parseQueryString(search),
          ...nextQueryParams,
        })}`
      ),
    [replace, search, pathname]
  );

  return result;
};

interface StringMap {
  [index: string]: string | string[];
}
