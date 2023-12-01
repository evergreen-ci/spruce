import { ProjectEventSettings } from "gql/generated/types";
import { Subset } from "types/utils";
import { getEventDiffLines } from "./eventLogDiffs";

const beforeAddition: Subset<ProjectEventSettings> = {
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

const afterAddition: Subset<ProjectEventSettings> = {
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

const beforeUpdate: Subset<ProjectEventSettings> = {
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
const afterUpdate: Subset<ProjectEventSettings> = {
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

const beforeDeletion: Subset<ProjectEventSettings> = {
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

const afterDeletion: Subset<ProjectEventSettings> = {
  __typename: "ProjectEventSettings",
  projectRef: {
    __typename: "Project",
    identifier: "viewTest",
    patchTriggerAliases: [],
  },
  vars: {
    __typename: "ProjectVars",
    vars: {},
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
  it("should transform deletions", () => {
    const diffLines = getEventDiffLines(beforeDeletion, afterDeletion);
    expect(diffLines).toStrictEqual([
      {
        key: "vars.vars.newVariable",
        before: "so new",
        after: undefined,
      },
    ]);
  });
});
