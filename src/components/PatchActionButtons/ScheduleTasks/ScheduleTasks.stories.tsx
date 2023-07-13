import WithToastContext from "test_utils/toast-decorator";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { ScheduleTasks } from ".";
import { mocks } from "./testData";

export default {
  component: ScheduleTasks,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks,
    },
  },
} satisfies CustomMeta<typeof ScheduleTasks>;

export const ScheduleTasksPopulated: CustomStoryObj<typeof ScheduleTasks> = {
  render: () => <ScheduleTasks isButton versionId="version" />,
};

export const ScheduleTasksEmpty: CustomStoryObj<typeof ScheduleTasks> = {
  render: () => <ScheduleTasks isButton versionId="emptyVersion" />,
};
