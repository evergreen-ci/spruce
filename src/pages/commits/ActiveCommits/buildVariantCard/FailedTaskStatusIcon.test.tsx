import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { act, render, waitFor } from "test_utils/test-utils";
import { FailedTaskStatusIcon } from "./FailedTaskStatusIcon";

const props = {
  displayName: "multiversion",
  timeTaken: 2754729,
  taskId: "task",
};
test("Tooltip should contain task name, duration and list of failing test names", async () => {
  const { queryByDataCy, queryByText, debug } = render(
    <MemoryRouter>
      <MockedProvider mocks={[getTooltipQueryMock]} addTypename={false}>
        <FailedTaskStatusIcon {...props} status="failed" />
      </MockedProvider>
    </MemoryRouter>
  );
  userEvent.hover(queryByDataCy("failed-task-status-icon"));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
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

// test("Icon should link to task page", async () => {
//   const { queryByDataCy } = render(
//     <MemoryRouter>
//       <MockedProvider mocks={[getTooltipQueryMock]}>
//         <FailedTaskStatusIcon {...props} status="failed" />
//       </MockedProvider>
//     </MemoryRouter>
//   );
//   await waitFor(() => {
//     expect(queryByDataCy("failed-task-status-icon")).toBeInTheDocument();
//   });
//   await waitFor(() => {
//     expect(
//       queryByDataCy("failed-task-status-icon").querySelector("a")
//     ).toHaveAttribute("href", "/task/task");
//   });
// });

// test("No query is made when task status is not failing", async () => {
//   const { queryByDataCy } = render(
//     <MemoryRouter>
//       <MockedProvider mocks={[]}>
//         <FailedTaskStatusIcon {...props} status="succeeded" />
//       </MockedProvider>
//     </MemoryRouter>
//   );
//   await waitFor(() => {
//     expect(queryByDataCy("failed-task-status-icon")).toBeInTheDocument();
//   });
// });

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
