import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

export const useUpdateURLQueryParams = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const result = useMemo(
    () => (nextQueryParams: StringMap) => {
      const joinedParams = {
        ...parseQueryString(search),
        ...nextQueryParams,
      };

      replace(`${pathname}?${stringifyQuery(joinedParams)}`);
    },
    [replace, search, pathname]
  );

  return result;
};

interface StringMap {
  [index: string]: string | string[];
}
