import { useState } from "react";
import Dropdown from "components/Dropdown";
import { TreeSelect, TreeSelectProps } from "components/TreeSelect";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

export default {
  component: TreeSelect,
} satisfies CustomMeta<typeof TreeSelect>;

export const Default: CustomStoryObj<typeof TreeSelect> = {
  render: (args) => <BaseTreeSelect {...args} />,
};

export const WithDropdown: CustomStoryObj<typeof TreeSelect> = {
  render: (args) => (
    <Dropdown buttonText="Select">
      <BaseTreeSelect isDropdown {...args} />
    </Dropdown>
  ),
};

const BaseTreeSelect = (props: TreeSelectProps) => {
  const [value, setValue] = useState([]);
  return (
    <TreeSelect tData={treeData} state={value} onChange={setValue} {...props} />
  );
};

const treeData = [
  {
    key: "all",
    title: "All",
    value: "all",
  },
  {
    children: [
      {
        key: "rectangle",
        title: "rectangle",
        value: "rectangle",
      },
      {
        key: "circle",
        title: "circle",
        value: "circle",
      },
      {
        key: "rhombus",
        title: "rhombus",
        value: "rhombus",
      },
    ],
    key: "shapes",
    title: "Shapes",
    value: "shapes",
  },
  {
    key: "pass",
    title: "Pass",
    value: "pass",
  },
  {
    key: "failed",
    title:
      "REALLY LONG TITLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE!!!!!!!!!!!!!!!!!",
    value: "failed",
  },
  {
    key: "skip",
    title: "Skip",
    value: "skip",
  },
  {
    key: "silentfail",
    title: "Silent Fail",
    value: "silentfail",
  },
];
