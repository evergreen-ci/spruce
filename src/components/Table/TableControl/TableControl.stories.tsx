import { CustomStoryObj, CustomMeta } from "test_utils/types";

import TableControl from ".";

export default {
  component: TableControl,
} satisfies CustomMeta<typeof TableControl>;

export const Default: CustomStoryObj<typeof TableControl> = {
  args: {
    filteredCount: 10,
    label: "tasks",
    limit: 10,
    page: 0,
    totalCount: 100,
  },
  render: (args) => <TableControl {...args} />,
};
