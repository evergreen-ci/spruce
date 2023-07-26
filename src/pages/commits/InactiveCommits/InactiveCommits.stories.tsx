import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { InactiveCommitButton as InactiveCommits } from ".";

export default {
  component: InactiveCommits,
} satisfies CustomMeta<typeof InactiveCommits>;

export const Default: CustomStoryObj<typeof InactiveCommits> = {
  args: {
    hasFilters: false,
  },
  render: (args) => <InactiveCommits rolledUpVersions={versions} {...args} />,
};

const versions = [
  {
    author: "Mohamed Khelif",
    createTime: new Date("2021-06-16T23:38:13Z"),
    id: "123",
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
    upstreamProject: {
      project: "spruce",
      repo: "evergreen-ci",
      task: {
        execution: 0,
        id: "123",
      },
      triggerID: "123",
      triggerType: "task",
    },
  },
  {
    author: "Arjun Patel",
    createTime: new Date("2021-06-16T23:38:13Z"),
    id: "123",
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    author: "Mohamed Khelif",
    createTime: new Date("2021-06-16T23:38:13Z"),
    id: "123",
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    author: "Arjun Patel",
    createTime: new Date("2021-06-16T23:38:13Z"),
    id: "123",
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    author: "Elena Chen",
    createTime: new Date("2021-06-16T23:38:13Z"),
    id: "123",
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    author: "Sophie Stadler",
    createTime: new Date("2021-06-16T23:38:13Z"),
    id: "123",
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
];
