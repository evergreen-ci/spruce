import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { CommitRolledUpVersions } from "types/commits";
import { InactiveCommitButton as InactiveCommits } from ".";

export default {
  component: InactiveCommits,
} satisfies CustomMeta<typeof InactiveCommits>;

export const Default: CustomStoryObj<typeof InactiveCommits> = {
  render: (args) => <InactiveCommits rolledUpVersions={versions} {...args} />,
  args: {
    hasFilters: false,
  },
};

const versions: CommitRolledUpVersions = [
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
    ignored: false,
    upstreamProject: {
      owner: "evergreen",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      triggerID: "123",
      triggerType: "task",
      repo: "evergreen-ci",
      project: "spruce",
      task: {
        id: "123",
        execution: 0,
      },
    },
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
    ignored: false,
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
    ignored: false,
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
    ignored: false,
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Elena Chen",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
    ignored: true,
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Sophie Stadler",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
    ignored: false,
  },
];
