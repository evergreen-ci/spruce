import { PatchTab } from "types/patch";
import { TaskTab } from "types/task";
import {
  getTaskRoute,
  getVersionRoute,
  getSpawnHostRoute,
  getPatchRoute,
  getTaskHistoryRoute,
  getVariantHistoryRoute,
  getProjectPatchesRoute,
  getCommitQueueRoute,
  getCommitsRoute,
} from "./routes";

const identifierWithSpecialCharacters = "!?identifier@";
const escapedIdentifier = "!%3Fidentifier%40";

describe("getProjectPatchesRoute", () => {
  it("escapes special characters projectIdentifier", () => {
    expect(getProjectPatchesRoute(identifierWithSpecialCharacters)).toBe(
      `/project/${escapedIdentifier}/patches`,
    );
  });
});

describe("getCommitQueueRoute", () => {
  it("escapes special characters projectIdentifier", () => {
    expect(getCommitQueueRoute(identifierWithSpecialCharacters)).toBe(
      `/commit-queue/${escapedIdentifier}`,
    );
  });
});

describe("getCommitsRoute", () => {
  it("escapes special characters projectIdentifier", () => {
    expect(getCommitsRoute(identifierWithSpecialCharacters)).toBe(
      `/commits/${escapedIdentifier}`,
    );
  });
});

describe("getTaskRoute", () => {
  it("generates a test route with only an id", () => {
    expect(getTaskRoute("SomeId")).toBe("/task/SomeId");
  });
  it("generates a test route with only an id and a tab", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab })).toBe(
      "/task/SomeId/logs",
    );
  });
  it("generates a test route with only an id and some params", () => {
    expect(getTaskRoute("SomeId", { a: "b" })).toBe("/task/SomeId?a=b");
  });
  it("generates a test route with only an id, tab and some params", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab, a: "b" })).toBe(
      "/task/SomeId/logs?a=b",
    );
  });
});

describe("getVersionRoute", () => {
  it("generates a version route with  the default tab when provided an id", () => {
    expect(getVersionRoute("SomeId")).toBe("/version/SomeId/tasks");
  });
  it("generates a version route with only an id and a tab", () => {
    expect(getVersionRoute("SomeId", { tab: "tasks" as PatchTab })).toBe(
      "/version/SomeId/tasks",
    );
  });
  it("generates a version route with only an id and some params", () => {
    expect(getVersionRoute("SomeId", { variant: "b" })).toBe(
      "/version/SomeId/tasks?variant=b",
    );
  });
  it("generates a version route with only an id, tab and some params", () => {
    expect(
      getVersionRoute("SomeId", { tab: "tasks" as PatchTab, variant: "b" }),
    ).toBe("/version/SomeId/tasks?variant=b");
  });
});

describe("getSpawnHostRoute", () => {
  it("generates a default Spawn host route when provided with no params", () => {
    expect(getSpawnHostRoute({})).toBe("/spawn/host?");
  });
  it("generates a default Spawn host route with filled params when provided", () => {
    expect(
      getSpawnHostRoute({
        distroId: "ubuntu1604",
        taskId: "someTask",
        spawnHost: true,
      }),
    ).toBe("/spawn/host?distroId=ubuntu1604&spawnHost=True&taskId=someTask");
  });
});

describe("getPatchRoute", () => {
  it("generates a link to the version page if it is not provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: false })).toBe(
      "/version/somePatchId/tasks",
    );
  });
  it("generates a link to the patch configure page if it is provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toBe(
      "/patch/somePatchId/configure/tasks",
    );
  });
  it("generates a link with a default tab when none is provided", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toBe(
      "/patch/somePatchId/configure/tasks",
    );
  });
  it("generates a link with a provided tab", () => {
    expect(
      getPatchRoute("somePatchId", { configure: true, tab: "parameters" }),
    ).toBe("/patch/somePatchId/configure/parameters");
    expect(
      getPatchRoute("somePatchId", { configure: true, tab: "someTab" }),
    ).toBe("/patch/somePatchId/configure/someTab");
  });
});

describe("getTaskHistoryRoute", () => {
  it("generates a link to the task history page", () => {
    expect(getTaskHistoryRoute("someProject", "someTaskId")).toBe(
      "/task-history/someProject/someTaskId",
    );
  });
  it("escapes special characters projectIdentifier", () => {
    expect(
      getTaskHistoryRoute(identifierWithSpecialCharacters, "someTaskId"),
    ).toBe(`/task-history/${escapedIdentifier}/someTaskId`);
  });
  it("generates a link with failing or passing tests", () => {
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        filters: {
          failingTests: ["someFailingTest"],
        },
      }),
    ).toBe("/task-history/someProject/someTaskId?failed=someFailingTest");
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
        },
      }),
    ).toBe(
      "/task-history/someProject/someTaskId?failed=someFailingTest,someOtherFailingTest",
    );
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        filters: {
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe("/task-history/someProject/someTaskId?passed=somePassingTests");
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        filters: {
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/task-history/someProject/someTaskId?passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with failing and passing tests", () => {
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        filters: {
          failingTests: ["someFailingTest"],
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe(
      "/task-history/someProject/someTaskId?failed=someFailingTest&passed=somePassingTests",
    );
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/task-history/someProject/someTaskId?failed=someFailingTest,someOtherFailingTest&passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with a selectedCommit", () => {
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        selectedCommit: 1,
      }),
    ).toBe("/task-history/someProject/someTaskId?selectedCommit=1");
  });
  it("generates a link with a selectedCommit and test filters", () => {
    expect(
      getTaskHistoryRoute("someProject", "someTaskId", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
        },
        selectedCommit: 1,
      }),
    ).toBe(
      "/task-history/someProject/someTaskId?failed=someFailingTest,someOtherFailingTest&selectedCommit=1",
    );
  });
});

describe("getVariantHistoryRoute", () => {
  it("generates a link to the variant history page", () => {
    expect(getVariantHistoryRoute("someProject", "someVariantId")).toBe(
      "/variant-history/someProject/someVariantId",
    );
  });
  it("escapes special characters projectIdentifier", () => {
    expect(
      getVariantHistoryRoute(identifierWithSpecialCharacters, "someVariantId"),
    ).toBe(`/variant-history/${escapedIdentifier}/someVariantId`);
  });
  it("generates a link with failing or passing tests", () => {
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest"],
        },
      }),
    ).toBe("/variant-history/someProject/someVariant?failed=someFailingTest");
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?failed=someFailingTest,someOtherFailingTest",
    );
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe("/variant-history/someProject/someVariant?passed=somePassingTests");
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with failing and passing tests", () => {
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest"],
          passingTests: ["somePassingTests"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?failed=someFailingTest&passed=somePassingTests",
    );
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        filters: {
          failingTests: ["someFailingTest", "someOtherFailingTest"],
          passingTests: ["somePassingTests", "someOtherPassingTests"],
        },
      }),
    ).toBe(
      "/variant-history/someProject/someVariant?failed=someFailingTest,someOtherFailingTest&passed=somePassingTests,someOtherPassingTests",
    );
  });
  it("generates a link with a skip query param", () => {
    expect(
      getVariantHistoryRoute("someProject", "someVariant", {
        selectedCommit: 1,
      }),
    ).toBe("/variant-history/someProject/someVariant?selectedCommit=1");
  });
});
