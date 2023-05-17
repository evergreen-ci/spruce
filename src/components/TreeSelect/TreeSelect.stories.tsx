import { useState } from "react";
import { StoryObj } from "@storybook/react";
import Dropdown from "components/Dropdown";
import { TreeSelect, TreeSelectProps } from "components/TreeSelect";

export default {
  component: TreeSelect,
};

export const Default: StoryObj<TreeSelectProps> = {
  render: (args) => <BaseTreeSelect {...args} />,
};

export const WithDropdown: StoryObj<TreeSelectProps> = {
  render: (args) => (
    <Dropdown buttonText="Select">
      <BaseTreeSelect isDropdown {...args} />
    </Dropdown>
  ),
};

const BaseTreeSelect = (props) => {
  const [value, setValue] = useState([]);
  return (
    <TreeSelect tData={treeData} state={value} onChange={setValue} {...props} />
  );
};

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
