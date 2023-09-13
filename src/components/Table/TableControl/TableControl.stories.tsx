import { CustomStoryObj, CustomMeta } from "test_utils/types";
import TableControl from ".";

export default {
  component: TableControl,
} satisfies CustomMeta<typeof TableControl>;

export const Default: CustomStoryObj<typeof TableControl> = {
  render: (args) => <TableControl {...args} />,
  args: {
    filteredCount: 10,
    totalCount: 100,
    limit: 10,
    page: 0,
    label: "tasks",
  },
};
