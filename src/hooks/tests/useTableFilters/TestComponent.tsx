import React from "react";
import { useLocation } from "react-router";
import { CheckboxFilter, InputFilter } from "components/Table/Filters";
import { useTableInputFilter, useTableCheckboxFilter } from "hooks";
import { queryString } from "utils";

const { parseQueryString } = queryString;
const hostIdUrlParam = "hostId";

export const InputFilterTestComponent = () => {
  const [value, onChange, onFilter, onReset] = useTableInputFilter({
    urlSearchParam: hostIdUrlParam,
    sendAnalyticsEvent: () => undefined,
  });

  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  return (
    <>
      <div>host id from url: {queryParams[hostIdUrlParam] ?? "N/A"}</div>
      <InputFilter
        {...{
          placeholder: "Search ID",
          value,
          onChange,
          onFilter,
          onReset,
          submitButtonCopy: "Search",
        }}
      />
    </>
  );
};

const statusesUrlParam = "statuses";

export const CheckboxFilterTestComponent = () => {
  const [value, onChange, onFilter, onReset] = useTableCheckboxFilter({
    urlSearchParam: statusesUrlParam,
    sendAnalyticsEvent: () => undefined,
  });

  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const statusesFromUrl = queryParams[statusesUrlParam];

  const urlValue = Array.isArray(statusesFromUrl)
    ? statusesFromUrl.join()
    : statusesFromUrl ?? "none";

  return (
    <>
      <div>statuses from url: {urlValue}</div>
      <CheckboxFilter
        {...{
          statuses,
          value,
          onChange,
          onFilter,
          onReset,
        }}
      />
    </>
  );
};

export const statuses = [
  {
    title: "Running",
    value: "running",
    key: "running",
  },
  {
    title: "Terminated",
    value: "terminated",
    key: "terminated",
  },
];
