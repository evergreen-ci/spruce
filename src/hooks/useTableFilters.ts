import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { queryString, url } from "utils";

const { updateUrlQueryParam } = url;
const { parseQueryString } = queryString;

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface Params<SearchParam> {
  urlSearchParam: SearchParam; // the name of url param
  sendAnalyticsEvent: (filterBy: string) => void; // callback function to send analytics event
}

type UseInputFilterReturn = [
  string, // url param value
  (e: InputEvent) => void, // onChange handler
  () => void, // update url param
];

/*
 * @deprecated For use with antd tables
 */
export const useTableInputFilter = <SearchParam extends string>({
  sendAnalyticsEvent = () => undefined,
  urlSearchParam,
}: Params<SearchParam>): UseInputFilterReturn => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const urlParams = parseQueryString(search);

  const inputValueFromUrl = (urlParams[urlSearchParam] || "").toString();

  const [value, setValue] = useState(inputValueFromUrl);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);
  };

  const updateParams = () => {
    updateUrlQueryParam(
      urlSearchParam,
      value.trim(),
      search,
      navigate,
      pathname,
      true,
    );

    sendAnalyticsEvent(urlSearchParam);
  };

  return [value, onChange, updateParams];
};

type UseCheckboxFilterReturn = [
  string[], // url param value
  (e: InputEvent, key: string) => void, // onChange handler
];

/*
 * @deprecated For use with antd tables
 */
export const useTableCheckboxFilter = <SearchParam extends string>({
  sendAnalyticsEvent = () => undefined,
  urlSearchParam,
}: Params<SearchParam>): UseCheckboxFilterReturn => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const { [urlSearchParam]: rawStatuses } = parseQueryString(search);

  const valueFromUrl = Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses].filter((v) => v);

  const [value, setValue] = useState<string[]>(valueFromUrl);

  const onChange = (e: InputEvent, key: string): void => {
    let newValues: string[];
    if (e.target.checked) {
      newValues = [...value, key];
      setValue(newValues);
    } else {
      const index = value.findIndex((v) => v === key);
      newValues = [...value.slice(0, index), ...value.slice(index + 1)];
      setValue(newValues);
    }

    updateUrlQueryParam(
      urlSearchParam,
      newValues,
      search,
      navigate,
      pathname,
      true,
    );
    sendAnalyticsEvent(urlSearchParam);
  };

  return [value, onChange];
};
