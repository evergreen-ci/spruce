import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

export const useUpdateURLQueryParams = () => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const updateQueryParams = useCallback(
    (nextQueryParams: StringMap) => {
      const joinedParams = {
        ...parseQueryString(search),
        ...nextQueryParams,
      };

      navigate(`${pathname}?${stringifyQuery(joinedParams)}`, {
        replace: true,
      });
    },
    [navigate, search, pathname]
  );

  return updateQueryParams;
};

interface StringMap {
  [index: string]: string | string[];
}
