import { CustomStoryObj, CustomMeta } from "test_utils/types";
import GroupedFilesTable from ".";

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
  title: "Pages/Task/table/GroupedFilesTable",
  component: GroupedFilesTable,
} satisfies CustomMeta<typeof GroupedFilesTable>;

export const DefaultTable: CustomStoryObj<typeof GroupedFilesTable> = {
  render: (args) => <GroupedFilesTable {...args} />,
  args: {
    taskName: "Task 1",
    files,
  },
};
