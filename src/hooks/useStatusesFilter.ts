import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { usePrevious } from "hooks"
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;
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
): [string[], (newValue: string[]) => void, (newValue: string[]) => void, () => void, () => void] => {
  const { search } = useLocation();
  const { [urlParam]: rawStatuses } = parseQueryString(search);
  const currUrlStatuses = Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses].filter((v) => v);

  const prevUrlStatuses = usePrevious(currUrlStatuses)

  const [value, setValue] = useState(currUrlStatuses)

  // update value when URL params change
  useEffect(() => {
    const prevSet = new Set(prevUrlStatuses)
    const currSet = new Set(currUrlStatuses)
    const areEqualUrlStatuses = prevSet.size === currSet.size && currUrlStatuses.reduce((accum, curr) => accum && prevSet.has(curr), true)

    const inputSet = new Set(value)
    const areEqualCurrUrlStatusesAndInputValue = inputSet.size === currSet.size && value.reduce((accum, curr) => accum && currSet.has(curr), true)

    if (!areEqualUrlStatuses && !areEqualCurrUrlStatusesAndInputValue) {
      setValue(currUrlStatuses)
    }
  }, [currUrlStatuses, prevUrlStatuses, value])

  const updateOnly = (newValue: string[]): void => {
    setValue(newValue)
  }

  const submitOnly = () => {
    updateQueryParams({
      [urlParam]: value,
      ...(resetPage && { page: "0" }),
    });
    sendAnalyticsEvent(urlParam);
  }

  const reset = () => {
    updateQueryParams({
      [urlParam]: [],
      ...(resetPage && { page: "0" }),
    });
  }

  const updateQueryParams = useUpdateURLQueryParams();

  const onUpdateAndSubmit = (newValue: string[]): void => {
    setValue(newValue)
    updateQueryParams({
      [urlParam]: newValue,
      ...(resetPage && { page: "0" }),
    });
    sendAnalyticsEvent(urlParam);
  };

  return [value, onUpdateAndSubmit, updateOnly, submitOnly, reset];
};
