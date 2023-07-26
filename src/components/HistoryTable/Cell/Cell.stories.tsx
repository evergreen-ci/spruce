import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskCell, EmptyCell, LoadingCell, ColumnHeaderCell } from ".";

export default {
  component: TaskCell,
  title: "components/HistoryTable/Cell",
} satisfies CustomMeta<typeof TaskCell>;

export const TaskCellStory: CustomStoryObj<typeof TaskCell> = {
  render: (args) => <TaskCell {...args} />,
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
};

export const EmptyCellStory: CustomStoryObj<typeof EmptyCell> = {
  render: () => <EmptyCell />,
  args: {},
};

export const LoadingCellStory: CustomStoryObj<typeof LoadingCell> = {
  render: (args) => <LoadingCell {...args} />,
  args: {},
};

export const ColumnHeaderCellStory: CustomStoryObj<typeof ColumnHeaderCell> = {
  render: (args) => <ColumnHeaderCell {...args} />,
  args: {
    link: "https://spruce.mongodb.com",
    trimmedDisplayName: "displayName",
    fullDisplayName: "LongWindedDisplayName",
  },
};
