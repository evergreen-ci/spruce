import { css } from "@leafygreen-ui/emotion";
import { TaskQueueItem, TaskQueueItemType } from "gql/generated/types";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import TaskQueueTable from ".";

const generateTaskQueue = (length: number): TaskQueueColumnData[] => {
  const tq: TaskQueueColumnData[] = [];

  for (let i = 0; i < length; i++) {
    const task: TaskQueueColumnData = {
      activatedBy: "admin",
      buildVariant: "osx-108-debug",
      displayName: "compile",
      expectedDuration: 600000,
      id: `task_${i}`,
      priority: 0,
      project:
        "23c73fc8a605de0e6d71f776128544356dca2a243a459db334d3514ae74a1ba7",
      requester: TaskQueueItemType.Commit,
      version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
      __typename: "TaskQueueItem",
    };

    tq.push(task);
  }

  return tq;
};

export default {
  component: TaskQueueTable,
} satisfies CustomMeta<typeof TaskQueueTable>;

export const Default: CustomStoryObj<typeof TaskQueueTable> = {
  render: (args) => (
    <div
      className={css`
        height: 700px;
        display: flex;
      `}
    >
      <TaskQueueTable {...args} />
    </div>
  ),
  argTypes: {},
  args: {
    loading: false,
    taskQueue: generateTaskQueue(5000),
  },
};
type TaskQueueColumnData = Omit<TaskQueueItem, "revision">;
