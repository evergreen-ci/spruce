import { StoryObj } from "@storybook/react";
import TableControl from ".";

export default {
  component: TableControl,
};

export const Default: StoryObj<typeof TableControl> = {
  render: (args) => <TableControl {...args} />,
  args: {
    filteredCount: 10,
    totalCount: 100,
    limit: 10,
    page: 0,
    label: "tasks",
  },
};
