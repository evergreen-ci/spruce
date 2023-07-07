import { CustomStoryObj, CustomMeta } from "test_utils/types";

import { TaskStatusIconLegend, LegendContent } from ".";

export default {
  component: TaskStatusIconLegend,
} satisfies CustomMeta<typeof TaskStatusIconLegend>;

export const LegendWithButton: CustomStoryObj<typeof TaskStatusIconLegend> = {
  render: () => <TaskStatusIconLegend />,
};

export const LegendOnly: CustomStoryObj<typeof LegendContent> = {
  render: () => <LegendContent />,
};
