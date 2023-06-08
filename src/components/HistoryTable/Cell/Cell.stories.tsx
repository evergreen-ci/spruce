import { StoryObj } from "@storybook/react";
import { TaskCell, EmptyCell, LoadingCell, ColumnHeaderCell } from ".";

export default {
  component: TaskCell,
  title: "components/HistoryTable/Cell",
};

export const TaskCellStory: StoryObj<typeof TaskCell> = {
  render: (args) => <TaskCell {...args} />,
  args: {
    task: {
      id: "task-1",
      status: "success",
    },
  },
};

export const EmptyCellStory: StoryObj<typeof EmptyCell> = {
  render: () => <EmptyCell />,
  args: {},
};

export const LoadingCellStory: StoryObj<typeof LoadingCell> = {
  render: (args) => <LoadingCell {...args} />,
  args: {},
};

export const ColumnHeaderCellStory: StoryObj<typeof ColumnHeaderCell> = {
  render: (args) => <ColumnHeaderCell {...args} />,
  args: {
    link: "https://spruce.mongodb.com",
    trimmedDisplayName: "displayName",
    fullDisplayName: "LongWindedDisplayName",
  },
};
