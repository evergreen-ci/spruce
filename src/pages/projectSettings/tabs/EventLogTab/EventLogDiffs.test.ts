import { getEventDiffLines } from "./EventLogDiffs";

const beforeAddition = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [],
  },
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};

const afterAddition = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [
      {
        __typename: "PatchTriggerAlias",
        alias: "newAlias",
        childProjectIdentifier: "evg",
      },
    ],
  },
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};

const beforeUpdate = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [
      {
        __typename: "PatchTriggerAlias",
        alias: "newAlias",
        childProjectIdentifier: "evg",
      },
    ],
  },
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};
const afterUpdate = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [
      {
        __typename: "PatchTriggerAlias",
        alias: "noLongerNewAlias",
        childProjectIdentifier: "evg",
      },
    ],
  },
  vars: {
    __typename: "ProjectVars",
    vars: { newVariable: "so new" },
  },
};

describe("should transform event diffs to key, before and after", () => {
  it("should transform updates", () => {
    const diffLines = getEventDiffLines(beforeUpdate, afterUpdate);
    expect(diffLines).toStrictEqual([
      {
        key: "projectRef.patchTriggerAliases[0].alias",
        before: "newAlias",
        after: "noLongerNewAlias",
      },
    ]);
  });
  it("should transform additions", () => {
    const diffLines = getEventDiffLines(beforeAddition, afterAddition);
    expect(diffLines).toStrictEqual([
      {
        key: "projectRef.patchTriggerAliases[0].alias",
        before: undefined,
        after: "newAlias",
      },
      {
        key: "projectRef.patchTriggerAliases[0].childProjectIdentifier",
        before: undefined,
        after: "evg",
      },
    ]);
  });
});
