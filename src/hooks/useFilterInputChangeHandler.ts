import { useState } from "react";
import debounce from "lodash.debounce";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "utils";

const arrayFormat = "comma";

const updateQueryParam = (
  urlSearchParam: string,
  inputValue: string | string[] | null,
  search: string,
  replace: (path: string) => void,
  pathname: string,
  sendAnalyticsEvent: (filterBy: string) => void,
  resetPage?: boolean
) => {
  const urlParams = parseQueryString(search);

  if (!inputValue) {
    delete urlParams[urlSearchParam];
  } else {
    urlParams[urlSearchParam] = inputValue;
  }

  const nextQueryParams = stringifyQuery({
    ...urlParams,
    ...(resetPage && { page: 0 }),
  });

  replace(`${pathname}?${nextQueryParams}`);

  sendAnalyticsEvent(urlSearchParam);
};

const updateQueryParamWithDebounce = debounce(updateQueryParam, 250);

type InputEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * useFilterInputChangeHandler updates the url query param (urlSearchParam) by the
 * the value user enters into the input field.
 * @param  {string} urlSearchParam the url search param that should update
 * @param  {string} pathname url pathname
 * @param  {string} search url search
 * @param  {(path:string)=>void} replace method from react router to update ur
 * @param {boolean} resetPage update url page param to 0 if true
 * @return {[string, (e: InputEvent) => void]}
 * pass {string} return value to input component as `value`
 * pass {(e: InputEvent) => void} return value to input component as onChange prop
 */
export const useFilterInputChangeHandler = (
  urlSearchParam: string,
  resetPage?: boolean,
  sendAnalyticsEvent: (filterBy: string) => void = () => undefined
): [string, (e: InputEvent) => void] => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const parsed = queryString.parse(search, { arrayFormat });
  const inputValue = (parsed[urlSearchParam] || "").toString();
  const [value, setValue] = useState(inputValue);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);
    updateQueryParamWithDebounce(
      urlSearchParam,
      e.target.value,
      search,
      replace,
      pathname,
      sendAnalyticsEvent,
      resetPage
    );
  };

  return [value, onChange];
};

interface Params<SearchParam> {
  urlSearchParam: SearchParam; // the name of url param
  sendAnalyticsEvent: (filterBy: string) => void; // callback function to send analytics event
}

type UseInputFilterReturn = [
  string, // url param value
  (e: InputEvent) => void, // onChange handler
  () => void, // update url param
  () => void // reset url param
];

// USE FOR FILTERS BUILT INTO TABLE COLUMN HEADERS
export const useInputFilter = <SearchParam extends string>({
  urlSearchParam,
  sendAnalyticsEvent = () => undefined,
}: Params<SearchParam>): UseInputFilterReturn => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const parsed = queryString.parse(search, { arrayFormat });

  const inputValueFromUrl = (parsed[urlSearchParam] || "").toString();

  const [value, setValue] = useState(inputValueFromUrl);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);
  };

  const updateUrlSearchParam = () => {
    updateQueryParam(
      urlSearchParam,
      value,
      search,
      replace,
      pathname,
      sendAnalyticsEvent,
      true // when does this need to be false?
    );

    sendAnalyticsEvent(urlSearchParam);
  };

  const resetQueryParam = () => {
    setValue("");

    updateQueryParam(
      urlSearchParam,
      null,
      search,
      replace,
      pathname,
      sendAnalyticsEvent,
      true // when does this need to be false?
    );
  };

  return [value, onChange, updateUrlSearchParam, resetQueryParam];
};

type UseTreeSelectFilterReturn = [
  string[], // url param value
  (e: string[]) => void, // onChange handler
  () => void, // update url param
  () => void // reset url param
];

export const useTreeSelectFilter = <SearchParam extends string>({
  urlSearchParam,
  sendAnalyticsEvent = () => undefined,
}: Params<SearchParam>): UseTreeSelectFilterReturn => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const { [urlSearchParam]: rawStatuses } = parseQueryString(search);

  const valueFromUrl = Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses].filter((v) => v);

  const [value, setValue] = useState<string[]>(valueFromUrl);

  const onChange = (newValue: string[]): void => {
    setValue(newValue);
  };

  const updateUrlSearchParam = () => {
    updateQueryParam(
      urlSearchParam,
      value,
      search,
      replace,
      pathname,
      sendAnalyticsEvent,
      true // when does this need to be false?
    );

    sendAnalyticsEvent(urlSearchParam);
  };

  const resetQueryParam = () => {
    setValue([]);

    updateQueryParam(
      urlSearchParam,
      null,
      search,
      replace,
      pathname,
      sendAnalyticsEvent,
      true // when does this need to be false?
    );
  };

  return [value, onChange, updateUrlSearchParam, resetQueryParam];
};
