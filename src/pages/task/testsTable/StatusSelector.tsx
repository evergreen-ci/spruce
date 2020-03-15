import React, { useState } from "react";
import { TreeSelect } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { RequiredQueryParams } from "types/task";
import { ValuesOfCorrectType } from "graphql/validation/rules/ValuesOfCorrectType";
import { usePrevious } from "hooks";
const { SHOW_PARENT } = TreeSelect;
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
const shouldPushAll = value => {
  if (
    value.includes("success") &&
    value.includes("fail") &&
    value.includes("skip") &&
    value.includes("silentfail")
  ) {
    return true;
  }
  return false;
};
export const StatusSelector = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const parsed = queryString.parse(search, { arrayFormat: "comma" });
  const statuses = parsed[RequiredQueryParams.Statuses];
  const value = Array.isArray(statuses) ? statuses : [statuses];
  const prevVal = usePrevious(value) || [];
  if (shouldPushAll(value)) {
    value.push("all");
  }
  const onChange = update => {
    const parsed = queryString.parse(search, { arrayFormat: "comma" });
    const nextStatuses =
      update.includes("all") && prevVal.length < update.length
        ? ["success", "fail", "silentfail", "skip"]
        : update.filter(v => v != "all");
    console.log(update, nextStatuses);
    parsed[RequiredQueryParams.Statuses] = nextStatuses;

    const nextQueryParams = queryString.stringify(parsed, {
      arrayFormat: "comma"
    });
    replace(`${pathname}?${nextQueryParams}`);
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
