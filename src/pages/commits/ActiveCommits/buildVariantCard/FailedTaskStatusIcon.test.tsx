import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { render, waitFor } from "test_utils/test-utils";
import { FailedTaskStatusIcon } from "./FailedTaskStatusIcon";

test("Tooltip should contain task name, duration and list of failing test names", async () => {
  const { queryByDataCy, queryByText } = render(
    <MemoryRouter>
      <MockedProvider mocks={[getTooltipQueryMock]}>
        <FailedTaskStatusIcon taskId="task" status="failed" />
      </MockedProvider>
    </MemoryRouter>
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
    expect(
      queryByText("jstests/multiVersion/remove_invalid_index_options.js")
    ).toBeVisible();
  });
});

const getTooltipQueryMock = {
  request: {
    query: GET_FAILED_TASK_STATUS_ICON_TOOLTIP,
    variables: { taskId: "task" },
  },
  result: {
    data: {
      task: {
        execution: 0,
        id:
          "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_display_multiversion_2b3e55a6af83938d4e6bade361728accc32d7018_21_10_05_15_51_10",
        displayName: "multiversion",
        timeTaken: 2754729,
        __typename: "Task",
      },
      taskTests: {
        testResults: [
          {
            id: "615ca2d14e103c8446af6f0e",
            testFile: "jstests/multiVersion/remove_invalid_index_options.js",
            __typename: "TestResult",
          },
        ],
        __typename: "TaskTestResult",
      },
    },
  },
};
