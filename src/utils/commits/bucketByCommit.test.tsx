import { FileDiffsFragment } from "gql/generated/types";
import { bucketByCommit } from "./bucketByCommit";

describe("bucketByCommit", () => {
  it("returns an empty array given an empty array", () => {
    expect(bucketByCommit([])).toStrictEqual([]);
  });

  it("returns the input file diffs bucketed by commit", () => {
    expect(bucketByCommit(input)).toStrictEqual(output);
  });
});

const input: FileDiffsFragment[] = [
  {
    __typename: "FileDiff",
    additions: 3,
    deletions: 0,
    description: "some other commit",
    diffLink:
      "http://localhost:9090/filediff/5e4ff3abe3c3317e352062e4?file_name=src%2Fpages%2FTask.tsx&patch_number=1",
    fileName: "src/pages/Task.tsx",
  },
  {
    __typename: "FileDiff",
    additions: 0,
    deletions: 32,
    description: "crazy cool commit!!!",
    diffLink:
      "http://localhost:9090/filediff/5e4ff3abe3c3317e352062e4?file_name=src%2FApp.tsx&patch_number=1",
    fileName: "src/App.tsx",
  },
  {
    __typename: "FileDiff",
    additions: 55,
    deletions: 22,
    description: "mega commit",
    diffLink:
      "http://localhost:9090/filediff/5e4ff3abe3c3317e352062e4?file_name=src%2Fpages%2FPatch.tsx&patch_number=1",
    fileName: "src/pages/Patch.tsx",
  },
];
const output = [
  [
    {
      __typename: "FileDiff",
      additions: 3,
      deletions: 0,
      description: "some other commit",
      diffLink:
        "http://localhost:9090/filediff/5e4ff3abe3c3317e352062e4?file_name=src%2Fpages%2FTask.tsx&patch_number=1",
      fileName: "src/pages/Task.tsx",
    },
  ],
  [
    {
      __typename: "FileDiff",
      additions: 0,
      deletions: 32,
      description: "crazy cool commit!!!",
      diffLink:
        "http://localhost:9090/filediff/5e4ff3abe3c3317e352062e4?file_name=src%2FApp.tsx&patch_number=1",
      fileName: "src/App.tsx",
    },
  ],
  [
    {
      __typename: "FileDiff",
      additions: 55,
      deletions: 22,
      description: "mega commit",
      diffLink:
        "http://localhost:9090/filediff/5e4ff3abe3c3317e352062e4?file_name=src%2Fpages%2FPatch.tsx&patch_number=1",
      fileName: "src/pages/Patch.tsx",
    },
  ],
];
