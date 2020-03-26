import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";

const arrayFormat = "comma";

export const useStatusesFilter = (
  urlParam: string
): [string[], (newValue: string[]) => void] => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const parsed = queryString.parse(search, { arrayFormat });

  const onChange = (newValue: string[]) => {
    const nextQueryParams = queryString.stringify({
      ...parsed,
      [urlParam]: newValue
    });
    replace(`${pathname}?${nextQueryParams}`);
  };

  const statuses = parsed[urlParam];
  const value = Array.isArray(statuses) ? statuses : [statuses].filter(v => v);
  return [value, onChange];
};
