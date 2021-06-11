import React, { useState } from "react";
import { TreeSelect } from "components/TreeSelect";

const treeData = [
  {
    title: "All",
    value: "all",
    key: "all",
  },
  {
    title: "Shapes",
    value: "shapes",
    key: "shapes",
    children: [
      {
        title: "rectangle",
        value: "rectangle",
        key: "rectangle",
      },
      {
        title: "circle",
        value: "circle",
        key: "circle",
      },
      {
        title: "rhombus",
        value: "rhombus",
        key: "rhombus",
      },
    ],
  },
  {
    title: "Pass",
    value: "pass",
    key: "pass",
  },
  {
    title:
      "REALLY LONG TITLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE!!!!!!!!!!!!!!!!!",
    value: "failed",
    key: "failed",
  },
  {
    title: "Skip",
    value: "skip",
    key: "skip",
  },
  {
    title: "Silent Fail",
    value: "silentfail",
    key: "silentfail",
  },
];

export default {
  title: "TreeSelect",
  component: TreeSelect,
};

export const NoInitialValues = () => {
  const [value, setValue] = useState([]);
  return (
    <TreeSelect
      tData={treeData}
      inputLabel="Items: "
      state={value}
      onChange={(v) => setValue(v)}
    />
  );
};

export const Ellipsis = () => {
  const [value, setValue] = useState([
    "trapezoid",
    "failed",
    "skip",
    "silentfail",
    "pass",
  ]);
  return (
    <TreeSelect
      tData={treeData}
      inputLabel="Items: "
      state={value}
      onChange={(v) => setValue(v)}
    />
  );
};

const noAllTreeData = [
  {
    title: "Shapes",
    value: "shapes",
    key: "shapes",
    children: [
      {
        title: "rectangle",
        value: "rectangle",
        key: "rectangle",
      },
      {
        title: "circle",
        value: "circle",
        key: "circle",
      },
      {
        title: "rhombus",
        value: "rhombus",
        key: "rhombus",
      },
    ],
  },
  {
    title: "Pass",
    value: "pass",
    key: "pass",
  },
  {
    title: "Failed",
    value: "failed",
    key: "failed",
  },
  {
    title: "Skip",
    value: "skip",
    key: "skip",
  },
  {
    title: "Silent Fail",
    value: "silentfail",
    key: "silentfail",
  },
];

export const NoAllButton = () => {
  const [value, setValue] = useState([
    "kite",
    "skip",
    "trapezoid",
    "failed",
    "skip",
    "silentfail",
    "pass",
  ]);
  return (
    <TreeSelect
      tData={noAllTreeData}
      inputLabel="Items: "
      state={value}
      onChange={(v) => setValue(v)}
    />
  );
};

export const AlwaysOpen = () => {
  const [value, setValue] = useState([]);
  return (
    <TreeSelect
      tData={treeData}
      inputLabel="Items: "
      state={value}
      onChange={(v) => setValue(v)}
      alwaysOpen
    />
  );
};
