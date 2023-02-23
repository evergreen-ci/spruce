import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import {
  GetFailedTaskStatusIconTooltipQuery,
  GetFailedTaskStatusIconTooltipQueryVariables,
} from "gql/generated/types";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { injectGlobalStyle, removeGlobalStyle } from "../utils";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

const props = {
  displayName: "multiversion",
  timeTaken: 2754729,
  taskId: "task",
  identifier: "ubuntu1604-multiversion",
};

jest.mock("../utils");

const Content = ({ status }: { status: string }) => (
  <MockedProvider mocks={[getTooltipQueryMock]} addTypename={false}>
    <WaterfallTaskStatusIcon {...props} status={status} />
  </MockedProvider>
);
describe("waterfallTaskStatusIcon", () => {
  it("tooltip should contain task name, duration, list of failing test names and additonal test count", async () => {
    render(<Content status="failed" />);
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

  it("should call the appropriate functions on hover and unhover", async () => {
    (injectGlobalStyle as jest.Mock).mockImplementationOnce(
      (taskIdentifier: string) => {
        Promise.resolve(taskIdentifier);
      }
    );
    (removeGlobalStyle as jest.Mock).mockImplementationOnce(() => {});

    render(<Content status="failed" />);
    userEvent.hover(screen.queryByDataCy("waterfall-task-status-icon"));
    await waitFor(() => {
      expect(injectGlobalStyle).toHaveBeenCalledTimes(1);
    });
    expect(injectGlobalStyle).toHaveBeenCalledWith(props.identifier);

    userEvent.unhover(screen.queryByDataCy("waterfall-task-status-icon"));
    await waitFor(() => {
      expect(removeGlobalStyle).toHaveBeenCalledTimes(1);
    });
  });
});

const getTooltipQueryMock: ApolloMock<
  GetFailedTaskStatusIconTooltipQuery,
  GetFailedTaskStatusIconTooltipQueryVariables
> = {
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
