import { MockedProvider } from "@apollo/client/testing";
import { addMilliseconds } from "date-fns";
import { GET_USER } from "gql/queries";
import { renderWithRouterMatch as render, screen } from "test_utils";
import { Metadata } from "./index";
import { taskQuery } from "./taskData";

const wrapper = ({ children }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
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
  });

  it("renders the metadata card with a succeeded status", () => {
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
  });
});

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";

const taskAboutToStart = {
  taskFiles: {
    ...taskQuery.taskFiles,
  },
  task: {
    ...taskQuery.task,
    status: "pending",
  },
};

const taskStarted = {
  taskFiles: {
    ...taskQuery.taskFiles,
  },
  task: {
    ...taskQuery.task,
    startTime: new Date(),
    estimatedStart: 0,
    status: "started",
  },
};
const taskSucceeded = {
  taskFiles: {
    ...taskStarted.taskFiles,
  },
  task: {
    ...taskStarted.task,
    finishTime: addMilliseconds(new Date(), 1228078),
    status: "succeeded",
  },
};
const mocks = [
  {
    request: {
      query: GET_USER,
    },
    result: {
      data: {
        user: {
          userId: "mohamed.khelif",
          displayName: "Mohamed Khelif",
          emailAddress: "a@mongodb.com",
        },
      },
    },
  },
];
