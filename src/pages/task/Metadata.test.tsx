import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { addMilliseconds } from "date-fns";
import { withRouter } from "react-router-dom";
import { GET_TASK_EVENT_DATA } from "analytics/task/query";
import { GET_USER, TASK_QUEUE_POSITION } from "gql/queries";
import { customRenderWithRouterMatch as render } from "test_utils/test-utils";
import { Metadata } from "./Metadata";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";

const taskQuery = {
  taskFiles: { __typename: "TaskFiles", fileCount: 38 },
  task: {
    isPerfPluginEnabled: false,
    __typename: "Task",
    activatedBy: "",
    baseTaskMetadata: {
      __typename: "BaseTaskMetadata",
      baseTaskDuration: 1228078,
      baseTaskLink:
        "https://evergreen.mongodb.com/task/spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
    },
    createTime: new Date("2020-08-26T19:20:41Z"),
    estimatedStart: 1000,
    displayName: "e2e_test",
    hostId: "i-0e0e62799806e037d",
    hostLink: "https://evergreen.mongodb.com/host/i-0e0e62799806e037d",
    patchMetadata: { __typename: "PatchMetadata", author: "mohamed.khelif" },
    patchNumber: 417,
    reliesOn: [],
    logs: {
      __typename: "TaskLogLinks",
      allLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=ALL",
      agentLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=E",
      systemLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=S",
      taskLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=T",
      eventLogLink:
        "https://evergreen.mongodb.com/event_log/task/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55",
    },
    status: "pending",
    version: "5f4889313627e0544660c800",
    revision: "e0ece5ad52ad01630bdf29f55b9382a26d6256b3",
    failedTestCount: 0,
    spawnHostLink:
      "https://evergreen.mongodb.com/spawn?distro_id=ubuntu1604-small&task_id=spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55",
    priority: 0,
    canRestart: true,
    canAbort: false,
    canSchedule: false,
    canUnschedule: false,
    canSetPriority: false,
    ami: "ami-0c83bb0a9f48c15bf",
    distroId: "ubuntu1604-small",
    latestExecution: 0,
    blocked: false,
    totalTestCount: 0,
  },
};

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
  {
    request: {
      query: GET_TASK_EVENT_DATA,
      variables: {
        taskId,
      },
    },
    result: {
      data: {
        task: {
          __typename: "Task",
          id: taskId,
          status: "started",
          failedTestCount: 0,
        },
      },
    },
  },
  {
    request: {
      query: TASK_QUEUE_POSITION,
      variables: {
        taskId,
      },
    },
    result: {
      data: {
        task: {
          __typename: "Task",
          id: taskId,
          minQueuePosition: 0,
        },
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
        data={taskAboutToStart}
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
        data={taskStarted}
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
        data={taskSucceeded}
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
