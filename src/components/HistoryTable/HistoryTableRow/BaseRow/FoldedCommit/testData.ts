import { FoldedCommitsRow, rowType } from "components/HistoryTable/types";

const rolledUpCommits = [
  {
    author: "A developer",
    createTime: new Date("2021-09-22T19:33:22Z"),
    id: "1",
    message: "v2.17.0",
    order: 1010,
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    author: "A developer",
    createTime: new Date("2021-09-23T19:33:22Z"),
    id: "2",
    message: "v2.17.1",
    order: 1020,
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    author: "A developer",
    createTime: new Date("2021-09-24T19:33:22Z"),
    id: "3",
    message: "v2.17.2",
    order: 1030,
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    author: "A developer",
    createTime: new Date("2021-09-25T19:33:22Z"),
    id: "4",
    message: "v2.17.3",
    order: 1040,
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    author: "A developer",
    createTime: new Date("2021-09-26T19:33:22Z"),
    id: "5",
    message: "v2.17.4",
    order: 1050,
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
];

const foldedCommitData: FoldedCommitsRow = {
  date: new Date("2023-06-06"),
  expanded: false,
  rolledUpCommits,
  selected: false,
  type: rowType.FOLDED_COMMITS,
};

export { foldedCommitData };
