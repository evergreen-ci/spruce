import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

export const useUpdateURLQueryParams = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const result = useMemo(
    () => (nextQueryParams: StringMap, deleteKeys?: string[]) => {
      const joinedParams = {
        ...parseQueryString(search),
        ...nextQueryParams,
      };

      // remove any keys included in the delete list
      const filteredParams = deleteKeys?.length
        ? Object.entries(joinedParams)
            .filter((p) => !deleteKeys.includes(p[0]))
            .reduce((curr, accum) => ({ ...accum, [curr[0]]: curr[1] }), {})
        : joinedParams;

      replace(`${pathname}?${stringifyQuery(filteredParams)}`);
    },
    [replace, search, pathname]
  );

  return result;
};

interface StringMap {
  [index: string]: string | string[];
}
