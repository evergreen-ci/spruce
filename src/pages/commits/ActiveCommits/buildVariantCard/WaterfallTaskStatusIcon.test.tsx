import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import {
  renderWithRouterMatch as render,
  waitFor,
} from "test_utils/test-utils";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

const props = {
  displayName: "multiversion",
  timeTaken: 2754729,
  taskId: "task",
};

const Content = (status: string) => () => (
  <MockedProvider mocks={[getTooltipQueryMock]} addTypename={false}>
    <WaterfallTaskStatusIcon {...props} status={status} />
  </MockedProvider>
);

test("Tooltip should contain task name, duration, list of failing test names and additonal test count", async () => {
  const { queryByDataCy, queryByText } = render(Content("failed"), {
    route: "/commits/evergreen",
  });
  userEvent.hover(queryByDataCy("waterfall-task-status-icon"));
  await waitFor(() => {
    expect(queryByDataCy("waterfall-task-status-icon-tooltip")).toBeVisible();
  });
  await waitFor(() => {
    expect(queryByText("multiversion - 45m 54s")).toBeVisible();
  });

  await waitFor(() => {
    expect(
      queryByText("jstests/multiVersion/remove_invalid_index_options.js")
    ).toBeVisible();
  });
  // await waitFor(() => {
  //   expect(queryByText("and 2 more")).toBeVisible();
  // });
});

test("Icon should link to task page", async () => {
  const { queryByDataCy } = render(Content("failed"), {
    route: "/commits/evergreen",
  });
  await waitFor(() => {
    expect(queryByDataCy("waterfall-task-status-icon")).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(queryByDataCy("waterfall-task-status-icon")).toHaveAttribute(
      "href",
      "/task/task"
    );
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
        filteredTestCount: 3,
        testResults: [
          {
            id: "83ca0a6b4c73f32e53f3dcbbe727842c",
            testFile: "jstests/multiVersion/remove_invalid_index_options.js",
          },
        ],
      },
    },
  },
};
