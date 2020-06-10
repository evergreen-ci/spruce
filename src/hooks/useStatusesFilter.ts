import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";

/**
 * @param  {string} urlParam the param that will appear in the url search, e.g. `statuses`, `baseStatuses`
 * @param {boolean} page reset url page param to 0 if true
 * @param {boolean} resetPage update url page param to 0 if true
 * @return {[string[], (newValue: string[]) => void]}
 * pass first value in return array to `value` prop of dropdown component
 * pass second value in return array to `onChange` prop of dropdown component
 */
export const useStatusesFilter = (
  urlParam: string,
  resetPage?: boolean,
  sendAnalyticsEvent: (filterBy: string) => void = () => undefined
): [string[], (newValue: string[]) => void] => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const onChange = (newValue: string[]): void => {
    const parsed = queryString.parse(search, { arrayFormat });
    const nextQueryParams = queryString.stringify(
      {
        ...parsed,
        [urlParam]: newValue,
        ...(resetPage && { page: 0 }),
      },
      { arrayFormat }
    );
    replace(`${pathname}?${nextQueryParams}`);
    sendAnalyticsEvent(urlParam);
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
