import { useState } from "react";
import { TreeSelect } from "components/TreeSelect";

const treeData = [
  {
    title: "Components/All",
    value: "all",
    key: "all",
  },
  {
    title: "Components/Shapes",
    value: "shapes",
    key: "shapes",
    children: [
      {
        title: "Components/rectangle",
        value: "rectangle",
        key: "rectangle",
      },
      {
        title: "Components/circle",
        value: "circle",
        key: "circle",
      },
      {
        title: "Components/rhombus",
        value: "rhombus",
        key: "rhombus",
      },
    ],
  },
  {
    title: "Components/Pass",
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
    title: "Components/Skip",
    value: "skip",
    key: "skip",
  },
  {
    title: "Components/Silent Fail",
    value: "silentfail",
    key: "silentfail",
  },
];

export default {
  title: "Components/TreeSelect",
  component: TreeSelect,
};

export const NoInitialValues = () => {
  const [value, setValue] = useState([]);
  return <TreeSelect tData={treeData} state={value} onChange={setValue} />;
};

export const Ellipsis = () => {
  const [value, setValue] = useState([
    "trapezoid",
    "failed",
    "skip",
    "silentfail",
    "pass",
  ]);
  return <TreeSelect tData={treeData} state={value} onChange={setValue} />;
};

const noAllTreeData = [
  {
    title: "Components/Shapes",
    value: "shapes",
    key: "shapes",
    children: [
      {
        title: "Components/rectangle",
        value: "rectangle",
        key: "rectangle",
      },
      {
        title: "Components/circle",
        value: "circle",
        key: "circle",
      },
      {
        title: "Components/rhombus",
        value: "rhombus",
        key: "rhombus",
      },
    ],
  },
  {
    title: "Components/Pass",
    value: "pass",
    key: "pass",
  },
  {
    title: "Components/Failed",
    value: "failed",
    key: "failed",
  },
  {
    title: "Components/Skip",
    value: "skip",
    key: "skip",
  },
  {
    title: "Components/Silent Fail",
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
  return <TreeSelect tData={noAllTreeData} state={value} onChange={setValue} />;
};

export const NoDropdown = () => {
  const [value, setValue] = useState([
    "kite",
    "skip",
    "trapezoid",
    "failed",
    "skip",
    "silentfail",
    "pass",
  ]);
  return <TreeSelect tData={noAllTreeData} state={value} onChange={setValue} />;
};
