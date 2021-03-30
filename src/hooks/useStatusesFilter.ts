import { useLocation } from "react-router-dom";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseQueryString } from "utils";
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
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();

  const onChange = (newValue: string[]): void => {
    updateQueryParams({
      [urlParam]: newValue,
      ...(resetPage && { page: "0" }),
    });

    sendAnalyticsEvent(urlParam);
  };

  const { [urlParam]: rawStatuses } = parseQueryString(search);
  const value = Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses].filter((v) => v);
  return [value, onChange];
};
