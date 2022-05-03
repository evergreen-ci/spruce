import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

export default {
  title: "WaterfallTaskStatusIcon",
  decorators: [
    (Story) => (
      <MemoryRouter>
        <MockedProvider mocks={[getTooltipQueryMock]} addTypename={false}>
          <Story />
        </MockedProvider>
      </MemoryRouter>
    ),
  ],
  component: WaterfallTaskStatusIcon,
};

const props = {
  displayName: "multiversion",
  timeTaken: 2754729,
  taskId: "task",
  identifier: "ubuntu1604-multiversion",
};

export const FailedIcon = () => (
  <WaterfallTaskStatusIcon {...props} status="failed" />
);

export const SuccessIcon = () => (
  <WaterfallTaskStatusIcon {...props} status="success" />
);

const getTooltipQueryMock = {
  request: {
    query: GET_FAILED_TASK_STATUS_ICON_TOOLTIP,
    variables: { taskId: "task" },
  },
  result: {
    data: {
      taskTests: {
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
