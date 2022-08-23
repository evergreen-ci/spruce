import { useCallback } from "react";
import pickBy from "lodash/pickby";
import { useNavigate, useLocation } from "react-router-dom";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

export const useUpdateURLQueryParams = () => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const updateQueryParams = useCallback(
    (nextQueryParams: StringMap) => {
      const params = pickBy(
        {
          ...parseQueryString(search),
          ...nextQueryParams,
        },
        (v) => v != null
      );

      navigate(`${pathname}?${stringifyQuery(params)}`, {
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
