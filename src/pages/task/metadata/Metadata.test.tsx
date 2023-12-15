import { MockedProvider } from "@apollo/client/testing";
import { addMilliseconds } from "date-fns";
import { getUserMock } from "gql/mocks/getUser";
import { taskQuery } from "gql/mocks/taskData";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { Metadata } from ".";

const wrapper = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);
describe("metadata", () => {
  it("renders the metadata card with a pending status", () => {
    render(
      <Metadata
        taskId={taskId}
        loading={false}
        task={taskAboutToStart.task}
        error={undefined}
      />,
      {
        route: `/task/${taskId}`,
        path: "/task/:id",
        wrapper,
      }
    );
    expect(
      screen.queryByDataCy("task-metadata-estimated_start")
    ).toHaveTextContent("1s");
    expect(screen.queryByDataCy("metadata-eta-timer")).toBeNull();
    expect(screen.queryByDataCy("task-metadata-started")).toBeNull();
    expect(screen.queryByDataCy("task-metadata-finished")).toBeNull();
  });
  it("renders the metadata card with a started status", () => {
    render(
      <Metadata
        taskId={taskId}
        loading={false}
        task={taskStarted.task}
        error={undefined}
      />,
      {
        route: `/task/${taskId}`,
        path: "/task/:id",
        wrapper,
      }
    );
    expect(screen.queryByDataCy("task-metadata-estimated_start")).toBeNull();
    expect(screen.getByDataCy("metadata-eta-timer")).toBeInTheDocument();
    expect(screen.getByDataCy("task-metadata-started")).toBeInTheDocument();
    expect(screen.queryByDataCy("task-metadata-finished")).toBeNull();
    expect(screen.queryByDataCy("task-trace-link")).toBeNull();
    expect(screen.queryByDataCy("task-metrics-link")).toBeNull();
  });

  it("renders the metadata card with a succeeded status", async () => {
    const user = userEvent.setup();
    render(
      <Metadata
        taskId={taskId}
        loading={false}
        task={taskSucceeded.task}
        error={undefined}
      />,
      {
        route: `/task/${taskId}`,
        path: "/task/:id",
        wrapper,
      }
    );

    expect(screen.queryByDataCy("task-metadata-estimated_start")).toBeNull();
    expect(screen.queryByDataCy("metadata-eta-timer")).toBeNull();
    expect(screen.getByDataCy("task-metadata-started")).toBeInTheDocument();
    expect(screen.getByDataCy("task-metadata-finished")).toBeInTheDocument();
    expect(screen.getByDataCy("task-trace-link")).toBeInTheDocument();
    expect(screen.getByDataCy("task-metrics-link")).toBeInTheDocument();

    expect(screen.getByDataCy("task-metadata-description")).toBeInTheDocument();
    expect(screen.getByText("more")).toBeInTheDocument();
    await user.hover(screen.getByText("more"));
    await screen.findByDataCy("task-metadata-description-tooltip");
    expect(
      screen.getByDataCy("task-metadata-description-tooltip")
    ).toHaveTextContent(taskSucceeded.task.details.description);
  });
});

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";

const taskAboutToStart = {
  task: {
    ...taskQuery.task,
    status: "pending",
  },
};

const taskStarted = {
  task: {
    ...taskQuery.task,
    estimatedStart: 0,
    startTime: new Date(),
    status: "started",
  },
};

const taskSucceeded = {
  task: {
    ...taskStarted.task,
    finishTime: addMilliseconds(new Date(), 1228078),
    status: "succeeded",
    details: {
      type: "",
      status: "success",
      description:
        "exiting due to custom reason: long long long long long long long long long long long long long message",
      traceID: "trace_abcde",
      oomTracker: {
        detected: false,
      },
      diskDevices: [],
    },
  },
};
