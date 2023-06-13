import { MockedProvider } from "@apollo/client/testing";
import {
  FailedTaskStatusIconTooltipQuery,
  FailedTaskStatusIconTooltipQueryVariables,
} from "gql/generated/types";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

const props = {
  displayName: "multiversion",
  timeTaken: 2754729,
  taskId: "task",
  identifier: "ubuntu1604-multiversion",
};

jest.mock("../utils");

const Content = ({
  status,
  failedTestCount = 0,
}: {
  status: string;
  failedTestCount?: number;
}) => (
  <MockedProvider mocks={[getTooltipQueryMock]} addTypename={false}>
    <WaterfallTaskStatusIcon
      {...props}
      status={status}
      failedTestCount={failedTestCount}
    />
  </MockedProvider>
);
describe("waterfallTaskStatusIcon", () => {
  it("tooltip should contain task name, duration, list of failing test names and additonal test count", async () => {
    render(<Content status="failed" failedTestCount={1} />);
    userEvent.hover(screen.queryByDataCy("waterfall-task-status-icon"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("waterfall-task-status-icon-tooltip")
      ).toBeVisible();
    });
    await waitFor(() => {
      expect(screen.queryByText("multiversion - 45m 54s")).toBeVisible();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(
          "jstests/multiVersion/remove_invalid_index_options.js"
        )
      ).toBeVisible();
    });
    await waitFor(() => {
      expect(screen.queryByText("and 2 more")).toBeVisible();
    });
  });

  it("icon should link to task page", async () => {
    render(<Content status="failed" />);
    await waitFor(() => {
      expect(
        screen.getByDataCy("waterfall-task-status-icon")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByDataCy("waterfall-task-status-icon")
      ).toHaveAttribute("href", "/task/task");
    });
  });
});

const getTooltipQueryMock: ApolloMock<
  FailedTaskStatusIconTooltipQuery,
  FailedTaskStatusIconTooltipQueryVariables
> = {
  request: {
    query: GET_FAILED_TASK_STATUS_ICON_TOOLTIP,
    variables: { taskId: "task" },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: "task",
        execution: 0,
        tests: {
          __typename: "TaskTestResult",
          filteredTestCount: 3,
          testResults: [
            {
              __typename: "TestResult",
              id: "83ca0a6b4c73f32e53f3dcbbe727842c",
              testFile: "jstests/multiVersion/remove_invalid_index_options.js",
            },
          ],
        },
      },
    },
  },
};
