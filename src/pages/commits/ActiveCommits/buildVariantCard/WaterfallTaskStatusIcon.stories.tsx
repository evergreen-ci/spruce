import { MockedProvider } from "@apollo/client/testing";
import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import {
  FailedTaskStatusIconTooltipQuery,
  FailedTaskStatusIconTooltipQueryVariables,
} from "gql/generated/types";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { ApolloMock } from "types/gql";
import { TaskStatus } from "types/task";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

export default {
  title: "Pages/Commits/WaterfallIcon",
  component: WaterfallTaskStatusIcon,
  decorators: [
    (Story: () => JSX.Element) => (
      <Container>
        <Story />
      </Container>
    ),
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[getTooltipQueryMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Default: StoryObj<typeof WaterfallTaskStatusIcon> = {
  render: (args) => <WaterfallTaskStatusIcon {...args} />,
  args: {
    displayName: "multiversion",
    timeTaken: 2754729,
    taskId: "task-id",
    identifier: "ubuntu1604",
    status: "failed",
    failedTestCount: 5,
  },
  argTypes: {
    status: {
      options: TaskStatus,
      control: { type: "select" },
    },
  },
};

const Container = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  margin-right: auto;
  margin-left: auto;
`;

const getTooltipQueryMock: ApolloMock<
  FailedTaskStatusIconTooltipQuery,
  FailedTaskStatusIconTooltipQueryVariables
> = {
  request: {
    query: GET_FAILED_TASK_STATUS_ICON_TOOLTIP,
    variables: { taskId: "task-id" },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: "task-id",
        execution: 0,
        tests: {
          __typename: "TaskTestResult",
          filteredTestCount: 2,
          testResults: [
            {
              __typename: "TestResult",
              id: "83ca0a6b4c73f32e53f3dcbbe727842c",
              testFile:
                "Grouped_status_icons_should_link_to_the_version_page_with_appropriate_table_filters.Waterfall_Task_Status_Icons_Grouped_status_icons_should_link_to_the_version_page_with_appropriate_table_filters",
            },
            {
              __typename: "TestResult",
              id: "09d1ecb06e9222a8fd294749a8ae8668",
              testFile:
                "Single_task_status_icons_should_link_to_the_corresponding_task_page.Waterfall_Task_Status_Icons_Single_task_status_icons_should_link_to_the_corresponding_task_page",
            },
          ],
        },
      },
    },
  },
};
