import React from "react";
import { TreeSelect } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { RequiredQueryParams } from "types/task";
import { TestStatus } from "types/task";
import { StatusSelect } from "./StatusSelect";
const { SHOW_PARENT } = TreeSelect;
const arrayFormat = "comma";
const COMPLETE = [
  TestStatus.Success,
  TestStatus.Fail,
  TestStatus.Skip,
  TestStatus.SilentFail,
  TestStatus.All
];
const EMPTY: string[] = [];

export const StatusSelector = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const value = getValueFromURL(search);
  const onChange = (updatedValue: [string]) => {
    if (
      !hasAll(value) &&
      (hasAll(updatedValue) || hasAllStatuses(updatedValue))
    ) {
      // user checks All box
      saveValueToURL({ replace, pathname, search, value: COMPLETE });
    } else if (
      hasAll(value) &&
      (!hasAll(updatedValue) || hasNoStatuses(updatedValue))
    ) {
      // user deselects All or all options aside from All are unchecked
      saveValueToURL({ replace, pathname, search, value: EMPTY });
    } else {
      // user selects all some statuses but not all of them
      saveValueToURL({
        replace,
        pathname,
        search,
        value: updatedValue.filter(v => v !== TestStatus.All)
      });
    }
  };

  // return <TreeSelect onChange={onChange} value={value} {...tProps} />;
  return <StatusSelect onChange={onChange} state={value} tData={treeData} />;
};

const hasAll = (statuses: string[]): boolean =>
  statuses && statuses.includes(TestStatus.All);

const hasAllStatuses = (statuses: string[]): boolean =>
  statuses &&
  statuses.includes(TestStatus.SilentFail) &&
  statuses.includes(TestStatus.Skip) &&
  statuses.includes(TestStatus.Success) &&
  statuses.includes(TestStatus.Fail);

const hasNoStatuses = (statuses: string[]): boolean =>
  !statuses ||
  (!statuses.includes(TestStatus.SilentFail) &&
    !statuses.includes(TestStatus.Skip) &&
    !statuses.includes(TestStatus.Success) &&
    !statuses.includes(TestStatus.Fail));

const treeData = [
  {
    title: "All",
    value: TestStatus.All,
    key: TestStatus.All,
    children: [
      {
        title: "foo",
        key: "foo",
        value: "foo"
      },
      {
        title: "bar",
        key: "bar",
        value: "bar",
        children: [
          {
            title: "fum",
            key: "fum",
            value: "fum"
          }
        ]
      }
    ]
  },
  {
    title: "Success",
    value: TestStatus.Success,
    key: TestStatus.Success
  },
  {
    title: "Failed",
    value: TestStatus.Fail,
    key: "failed"
  },
  {
    title: "Skip",
    value: TestStatus.Skip,
    key: TestStatus.Skip
  },
  {
    title: "Silent Fail",
    value: TestStatus.SilentFail,
    key: TestStatus.SilentFail
  }
];

const tProps = {
  placeholder: "Select Test Status",
  showCheckedStrategy: SHOW_PARENT,
  treeCheckable: true,
  treeData,
  treeDefaultExpandAll: true,
  style: {
    width: "387px"
  },
  suffixIcon: <span>wussuf</span>
};

const getValueFromURL = (search: string) => {
  const parsed = queryString.parse(search, { arrayFormat });
  const statuses = parsed[RequiredQueryParams.Statuses];
  return Array.isArray(statuses) ? statuses : [statuses].filter(v => v);
};

const saveValueToURL = ({
  pathname,
  replace,
  search,
  value
}: {
  pathname: string;
  replace: (path: string) => void;
  search: string;
  value: string[];
}) => {
  const parsed = queryString.parse(search, { arrayFormat });
  parsed[RequiredQueryParams.Statuses] = value;
  const nextQueryParams = queryString.stringify(parsed, { arrayFormat });
  replace(`${pathname}?${nextQueryParams}`);
};
