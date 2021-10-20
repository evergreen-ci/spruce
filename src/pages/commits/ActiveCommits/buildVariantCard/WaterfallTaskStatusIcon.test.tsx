import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import {  renderWithRouterMatch as render,  waitFor } from "test_utils/test-utils";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";
const Content = (status: string) => () => (
  <MockedProvider mocks={[getTooltipQueryMock]} addTypename={false}>
    <WaterfallTaskStatusIcon {...props} status={status} />
  </MockedProvider>
);
const props = {
  displayName: "multiversion",
  timeTaken: 2754729,
  taskId: "task",
};
// Skip this test for now since the MockProvider mock fails to return the query data after hovering.
// The same MockProvider mock works as expected in the corresponding Storybook file.
test.skip("Tooltip should contain task name, duration and list of failing test names", async () => {
  const { queryByDataCy, queryByText } = render(
   Commits("failed"),
   {
   route: "/commits/evergreen",
   }
  );
  userEvent.hover(queryByDataCy("failed-task-status-icon"));
  await waitFor(() => {
    expect(
      queryByDataCy("failed-task-status-icon-tooltip")
    ).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(queryByDataCy("failed-task-status-icon-tooltip")).toBeVisible();
  });
  await waitFor(() => {
    expect(queryByText("multiversion - 45m 54s")).toBeVisible();
  });

  await waitFor(() => {
    expect(
      queryByText("jstests/multiVersion/remove_invalid_index_options.js")
    ).toBeVisible();
  });
});

test("Icon should link to task page", async () => {
  const { queryByDataCy } = render(
    <MemoryRouter>
      <MockedProvider mocks={[getTooltipQueryMock]}>
        <WaterfallTaskStatusIcon {...props} status="failed" />
      </MockedProvider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(queryByDataCy("failed-task-status-icon")).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(
      queryByDataCy("failed-task-status-icon").querySelector("a")
    ).toHaveAttribute("href", "/task/task");
  });
});

test("No query is made when task status is not failing", async () => {
  const { queryByDataCy } = render(
    <MemoryRouter>
      <MockedProvider mocks={[]}>
        <WaterfallTaskStatusIcon {...props} status="succeeded" />
      </MockedProvider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(queryByDataCy("failed-task-status-icon")).toBeInTheDocument();
  });
});

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
