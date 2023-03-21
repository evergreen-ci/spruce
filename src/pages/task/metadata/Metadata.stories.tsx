import { MockedProvider } from "@apollo/client/testing";
import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import { MetStatus, RequiredStatus } from "gql/generated/types";
import { Metadata, MetadataProps } from "./index";
import { taskQuery } from "./taskData";

export default {
  title: "Pages/Task/Metadata",
  component: Metadata,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Default: StoryObj<MetadataProps> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={taskQuery.task}
        taskId={taskQuery.task.id}
        error={null}
      />
    </Container>
  ),
};

export const WithDependencies: StoryObj<MetadataProps> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
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
  ),
};

export const WithAbortMessage: StoryObj<
  { abortInfoSelection: string } & MetadataProps
> = {
  render: ({ abortInfoSelection, ...args }) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          aborted: true,
          abortInfo: abortInfoMap[abortInfoSelection],
        }}
        taskId={taskQuery.task.id}
        error={null}
      />
    </Container>
  ),
  args: {
    abortInfoSelection: "NoUser",
  },
  argTypes: {
    abortInfoSelection: {
      control: "select",
      options: [
        "NoUser",
        "AbortedBecauseOfFailingTask",
        "AbortedBecauseOfNewVersion",
        "AbortedBecausePRClosed",
      ],
    },
  },
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
