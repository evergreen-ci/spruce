import React, { useState } from "react";
import { TreeSelect } from "components/TreeSelect";

const treeData = [
  {
    title: "Shapes",
    value: "shapes",
    key: "shapes",
    children: [
      {
        title: "Quadrilateral",
        value: "quadrilateral",
        key: "quadrilateral",
        children: [
          {
            title: "Trapezoid",
            value: "trapezoid",
            key: "trapezoid"
          },
          {
            title: "Kite",
            value: "kite",
            key: "kite",
            children: [{ title: "Rhombus", value: "rhombus", key: "rhombus" }]
          }
        ]
      }
    ]
  },
  {
    title: "Pass",
    value: "pass",
    key: "pass"
  },
  {
    title: "Failed",
    value: "failed",
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

export default {
  title: "TreeSelect",
  component: TreeSelect
};

export const InitialValues = () => {
  const [value, setValue] = useState(["shapes", "kite", "skip", "trapezoid"]);
  return (
    <TreeSelect
      tData={treeData}
      inputLabel="Items: "
      optionsLabel={value.join(", ")}
      state={value}
      onChange={v => setValue(v)}
    />
  );
};
