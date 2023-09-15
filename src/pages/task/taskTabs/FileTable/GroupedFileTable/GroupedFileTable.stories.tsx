import { CustomStoryObj, CustomMeta } from "test_utils/types";
import GroupedFileTable from ".";

const files = [
  {
    name: "some_file",
    link: "some_link",
  },
  {
    name: "another_file",
    link: "another_link",
  },
];

export default {
  title: "Pages/Task/table/GroupedFileTable",
  component: GroupedFileTable,
} satisfies CustomMeta<typeof GroupedFileTable>;

export const DefaultTable: CustomStoryObj<typeof GroupedFileTable> = {
  render: (args) => <GroupedFileTable {...args} />,
  args: {
    taskName: "Task 1",
    files,
  },
};
