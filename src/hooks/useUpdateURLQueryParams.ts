import { useHistory, useLocation } from "react-router-dom";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

export const useUpdateURLQueryParams = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  return (nextQueryParams: StringMap) =>
    replace(
      `${pathname}?${stringifyQuery({
        ...parseQueryString(search),
        ...nextQueryParams,
      })}`
    );
};

interface StringMap {
  [index: string]: string | string[];
}
