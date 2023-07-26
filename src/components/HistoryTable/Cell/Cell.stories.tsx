import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskCell, EmptyCell, LoadingCell, ColumnHeaderCell } from ".";

export default {
  component: TaskCell,
  title: "components/HistoryTable/Cell",
} satisfies CustomMeta<typeof TaskCell>;

export const TaskCellStory: CustomStoryObj<typeof TaskCell> = {
  args: {
    task: {
      id: "task-1",
      status: "success",
    },
  },
  parameters: {
    reactRouter: {
      path: "/task/:id",
      route: "/task/task-1",
    },
  },
  render: (args) => <TaskCell {...args} />,
};

export const EmptyCellStory: CustomStoryObj<typeof EmptyCell> = {
  args: {},
  render: () => <EmptyCell />,
};

export const LoadingCellStory: CustomStoryObj<typeof LoadingCell> = {
  args: {},
  render: (args) => <LoadingCell {...args} />,
};

export const ColumnHeaderCellStory: CustomStoryObj<typeof ColumnHeaderCell> = {
  args: {
    fullDisplayName: "LongWindedDisplayName",
    link: "https://spruce.mongodb.com",
    trimmedDisplayName: "displayName",
  },
  render: (args) => <ColumnHeaderCell {...args} />,
};
