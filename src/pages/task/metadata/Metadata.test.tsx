import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { addMilliseconds } from "date-fns";
import { withRouter } from "react-router-dom";
import { GET_USER } from "gql/queries";
import { renderWithRouterMatch as render } from "test_utils/test-utils";
import { Metadata } from "./index";
import { taskQuery } from "./taskData";

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
        userId: "mohamed.khelif",
        displayName: "Mohamed Khelif",
      },
    },
  },
];

test("Renders the metadata card with a pending status", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks}>
      <Metadata
        taskId={taskId}
        loading={false}
        task={taskAboutToStart.task}
        error={undefined}
      />
    </MockedProvider>
  );

  const { queryByDataCy } = render(withRouter(ContentWrapper), {
    route: `/task/${taskId}`,
    path: "/task/:id",
  });
  expect(queryByDataCy("task-metadata-estimated_start")).toHaveTextContent(
    "1s"
  );
  expect(queryByDataCy("metadata-eta-timer")).toBeNull();
  expect(queryByDataCy("task-metadata-started")).toBeNull();
  expect(queryByDataCy("task-metadata-finished")).toBeNull();
});
test("Renders the metadata card with a started status", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks}>
      <Metadata
        taskId={taskId}
        loading={false}
        task={taskStarted.task}
        error={undefined}
      />
    </MockedProvider>
  );

  const { queryByDataCy } = render(withRouter(ContentWrapper), {
    route: `/task/${taskId}`,
    path: "/task/:id",
  });
  expect(queryByDataCy("task-metadata-estimated_start")).toBeNull();
  expect(queryByDataCy("metadata-eta-timer")).toBeInTheDocument();
  expect(queryByDataCy("task-metadata-started")).toBeInTheDocument();
  expect(queryByDataCy("task-metadata-finished")).toBeNull();
});

test("Renders the metadata card with a succeeded status", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks}>
      <Metadata
        taskId={taskId}
        loading={false}
        task={taskSucceeded.task}
        error={undefined}
      />
    </MockedProvider>
  );

  const { queryByDataCy } = render(withRouter(ContentWrapper), {
    route: `/task/${taskId}`,
    path: "/task/:id",
  });

  expect(queryByDataCy("task-metadata-estimated_start")).toBeNull();
  expect(queryByDataCy("metadata-eta-timer")).toBeNull();
  expect(queryByDataCy("task-metadata-started")).toBeInTheDocument();
  expect(queryByDataCy("task-metadata-finished")).toBeInTheDocument();
});
