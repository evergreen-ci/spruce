import { ProjectEventSettings } from "gql/generated/types";
import { Subset } from "types/utils";
import { getEventDiffLines } from "./EventLogDiffs";

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
        after: "noLongerNewAlias",
        before: "newAlias",
        key: "projectRef.patchTriggerAliases[0].alias",
      },
    ]);
  });
  it("should transform additions", () => {
    const diffLines = getEventDiffLines(beforeAddition, afterAddition);
    expect(diffLines).toStrictEqual([
      {
        after: "newAlias",
        before: undefined,
        key: "projectRef.patchTriggerAliases[0].alias",
      },
      {
        after: "evg",
        before: undefined,
        key: "projectRef.patchTriggerAliases[0].childProjectIdentifier",
      },
    ]);
  });
  it("should transform deletions", () => {
    const diffLines = getEventDiffLines(beforeDeletion, afterDeletion);
    expect(diffLines).toStrictEqual([
      {
        after: undefined,
        before: "so new",
        key: "vars.vars.newVariable",
      },
    ]);
  });
});
