import { StoryObj } from "@storybook/react";
import { TaskStatusIconLegend, LegendContent } from ".";

export default {
  component: TaskStatusIconLegend,
};

export const LegendWithButton: StoryObj<typeof TaskStatusIconLegend> = {
  render: () => <TaskStatusIconLegend />,
};

export const LegendOnly: StoryObj<typeof LegendContent> = {
  render: () => <LegendContent />,
};
