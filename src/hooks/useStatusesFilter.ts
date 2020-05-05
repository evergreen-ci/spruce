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

  const onChange = (newValue: string[]): void => {
    const parsed = queryString.parse(search, { arrayFormat });
    const nextQueryParams = queryString.stringify(
      {
        ...parsed,
        [urlParam]: newValue,
      },
      { arrayFormat }
    );
    replace(`${pathname}?${nextQueryParams}`);
  };

  const { [urlParam]: rawStatuses } = queryString.parse(search, {
    arrayFormat,
  });
  const value = Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses].filter((v) => v);
  return [value, onChange];
};

const arrayFormat = "comma";
