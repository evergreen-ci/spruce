import styled from "@emotion/styled";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { MetStatus, RequiredStatus } from "gql/generated/types";
import { Metadata } from "./index";
import { taskQuery } from "./taskData";

export const Base = () => (
  <Container>
    <Metadata
      loading={boolean("Loading", false)}
      task={taskQuery.task}
      taskId={taskQuery.task.id}
      error={null}
    />
  </Container>
);

export const WithDependencies = () => (
  <Container>
    <Metadata
      loading={boolean("Loading", false)}
      task={{
        ...taskQuery.task,
        dependsOn: [
          {
            buildVariant: "ubuntu1604",
            metStatus: MetStatus.Unmet,
            name: "Some dep",
            requiredStatus: RequiredStatus.MustSucceed,
            taskId: "some_task_id_1",
          },
          {
            buildVariant: "ubuntu1604",
            metStatus: MetStatus.Pending,
            name: "Some dep",
            requiredStatus: RequiredStatus.MustFinish,
            taskId: "some_task_id_2",
          },
          {
            buildVariant: "ubuntu1604",
            metStatus: MetStatus.Met,
            name: "Some dep",
            requiredStatus: RequiredStatus.MustFail,
            taskId: "some_task_id_3",
          },
          {
            buildVariant: "ubuntu1604",
            metStatus: MetStatus.Started,
            name: "Some dep",
            requiredStatus: RequiredStatus.MustFail,
            taskId: "some_task_id_4",
          },
        ],
      }}
      taskId={taskQuery.task.id}
      error={null}
    />
  </Container>
);

export const WithAbortMessage = () => {
  const abortInfoSelection = select(
    "Abort Info",
    [
      "NoUser",
      "AbortedBecauseOfFailingTask",
      "AbortedBecauseOfNewVersion",
      "AbortedBecausePRClosed",
    ],
    "NoUser"
  );
  const abortInfo = abortInfoMap[abortInfoSelection];
  return (
    <Container>
      <Metadata
        loading={boolean("Loading", false)}
        task={{
          ...taskQuery.task,
          aborted: true,
          abortInfo,
        }}
        taskId={taskQuery.task.id}
        error={null}
      />
    </Container>
  );
};

export default {
  title: "Metadata",
  decorators: [StoryRouter(), withKnobs],
  component: Base,
};

const Container = styled.div`
  width: 400px;
`;

const abortInfoMap = {
  NoUser: {
    buildVariantDisplayName: "~ Commit Queue",
    newVersion: null,
    prClosed: false,
    taskDisplayName: "api-task-server",
    taskID: "abc",
    user: null,
  },
  AbortedBecauseOfFailingTask: {
    buildVariantDisplayName: "~ Commit Queue",
    newVersion: null,
    prClosed: false,
    taskDisplayName: "api-task-server",
    taskID: "abc",
    user: "apiserver",
  },
  AbortedBecauseOfNewVersion: {
    buildVariantDisplayName: null,
    newVersion: "5ee1efb3d1fe073e194e8b5c",
    prClosed: false,
    taskDisplayName: null,
    taskID: null,
    user: "apiserver",
  },
  AbortedBecausePRClosed: {
    buildVariantDisplayName: null,
    newVersion: null,
    prClosed: true,
    taskDisplayName: null,
    taskID: null,
    user: "apiserver",
  },
};
