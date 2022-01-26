import { boolean, withKnobs } from "@storybook/addon-knobs";
import { InactiveCommitButton as InactiveCommits } from ".";

export default {
  title: "Inactive Commits",
  component: InactiveCommits,
  decorators: [withKnobs],
};

export const Story = () => (
  <InactiveCommits
    rolledUpVersions={versions}
    hasFilters={boolean("hasFilters", false)}
  />
);

const versions = [
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Elena Chen",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "123",
    createTime: new Date("2021-06-16T23:38:13Z"),
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Sophie Stadler",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
];
