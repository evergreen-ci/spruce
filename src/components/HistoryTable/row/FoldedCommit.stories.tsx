import { FoldedCommit } from "./FoldedCommit";

export default {
  title: "Folded Commit",
  component: FoldedCommit,
};

export const FoldedInactiveCommits = () => (
  <FoldedCommit rolledUpCommits={rolledUpCommits} />
);

const rolledUpCommits = [
  {
    id: "1",
    createTime: new Date("2021-09-22T19:33:22Z"),
    author: "A developer",
    order: 1010,
    message: "v2.17.0",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "2",
    createTime: new Date("2021-09-23T19:33:22Z"),
    author: "A developer",
    order: 1020,
    message: "v2.17.0",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "3",
    createTime: new Date("2021-09-24T19:33:22Z"),
    author: "A developer",
    order: 1030,
    message: "v2.17.0",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "4",
    createTime: new Date("2021-09-25T19:33:22Z"),
    author: "A developer",
    order: 1040,
    message: "v2.17.0",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "5",
    createTime: new Date("2021-09-26T19:33:22Z"),
    author: "A developer",
    order: 1050,
    message: "v2.17.0",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
];
