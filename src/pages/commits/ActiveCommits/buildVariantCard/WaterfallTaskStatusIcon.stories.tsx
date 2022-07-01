import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

const getTooltipQueryMock = {
  request: {
    query: GET_FAILED_TASK_STATUS_ICON_TOOLTIP,
    variables: { taskId: "task-id" },
  },
  result: {
    data: {
      taskTests: {
        filteredTestCount: 2,
        testResults: [
          {
            id: "83ca0a6b4c73f32e53f3dcbbe727842c",
            testFile:
              "Grouped_status_icons_should_link_to_the_version_page_with_appropriate_table_filters.Waterfall_Task_Status_Icons_Grouped_status_icons_should_link_to_the_version_page_with_appropriate_table_filters",
          },
          {
            id: "09d1ecb06e9222a8fd294749a8ae8668",
            testFile:
              "Single_task_status_icons_should_link_to_the_corresponding_task_page.Waterfall_Task_Status_Icons_Single_task_status_icons_should_link_to_the_corresponding_task_page",
          },
        ],
      },
    },
  },
};

export default {
  title: "Pages/Commits/WaterfallIcon",
  component: WaterfallTaskStatusIcon,
  args: {
    displayName: "multiversion",
    timeTaken: 2754729,
    taskId: "task-id",
    identifier: "ubuntu1604",
  },
  parameters: {
    apolloClient: {
      mocks: [getTooltipQueryMock],
    },
  },
};

export const FailedIcon = (args) => (
  <WaterfallTaskStatusIcon {...args} status="failed" />
);

export const SuccessIcon = (args) => (
  <WaterfallTaskStatusIcon {...args} status="success" />
);
