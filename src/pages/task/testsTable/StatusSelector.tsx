import React from "react";
import { TreeSelect } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { RequiredQueryParams } from "types/task";
import { usePrevious } from "hooks";
const { SHOW_PARENT } = TreeSelect;
const arrayFormat = "comma";

export const StatusSelector = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const parsed = queryString.parse(search, { arrayFormat });
  const statuses = parsed[RequiredQueryParams.Statuses];
  const value = Array.isArray(statuses) ? statuses : [statuses].filter(v => v);
  const prevVal = usePrevious(value) || [];

  const onChange = update => {
    replace(`${pathname}?${update.join(",")}`);
  };

  const tProps = {
    treeData,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "100%"
    }
  };
  return <TreeSelect {...tProps} />;
};

const treeData = [
  {
    title: "All",
    value: "all",
    key: "all"
  },
  {
    title: "Success",
    value: "success",
    key: "success"
  },
  {
    title: "Failed",
    value: "fail",
    key: "failed"
  },
  {
    title: "Skip",
    value: "skip",
    key: "skip"
  },
  {
    title: "Silent Fail",
    value: "silentfail",
    key: "silentfail"
  }
];
