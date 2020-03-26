import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";

/**
 * @param  {string} urlParam the param that will appear in the url search, e.g. `statuses`, `baseStatuses`
 * @return {[string[], (newValue: string[]) => void]}
 * pass first value in return array to `value` prop of dropdown component
 * pass second value in return array to `onChange` prop of dropdown component
 */
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

const arrayFormat = "comma";
