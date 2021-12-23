import { PatchTab } from "types/patch";
import { TaskTab } from "types/task";
import {
  getTaskRoute,
  getVersionRoute,
  getSpawnHostRoute,
  getPatchRoute,
} from "./routes";

describe("getTaskRoute", () => {
  it("generates a test route with only an id", () => {
    expect(getTaskRoute("SomeId")).toBe("/task/SomeId");
  });
  it("generates a test route with only an id and a tab", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab })).toBe(
      "/task/SomeId/logs"
    );
  });
  it("generates a test route with only an id and some params", () => {
    expect(getTaskRoute("SomeId", { a: "b" })).toBe("/task/SomeId?a=b");
  });
  it("generates a test route with only an id, tab and some params", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab, a: "b" })).toBe(
      "/task/SomeId/logs?a=b"
    );
  });
});

describe("getVersionRoute", () => {
  it("generates a version route with  the default tab when provided an id", () => {
    expect(getVersionRoute("SomeId")).toBe("/version/SomeId/tasks?");
  });
  it("generates a version route with only an id and a tab", () => {
    expect(getVersionRoute("SomeId", { tab: "tasks" as PatchTab })).toBe(
      "/version/SomeId/tasks?"
    );
  });
  it("generates a version route with only an id and some params", () => {
    expect(getVersionRoute("SomeId", { variant: "b" })).toBe(
      "/version/SomeId/tasks?variant=b"
    );
  });
  it("generates a version route with only an id, tab and some params", () => {
    expect(
      getVersionRoute("SomeId", { tab: "tasks" as PatchTab, variant: "b" })
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
      })
    ).toBe("/spawn/host?distroId=ubuntu1604&spawnHost=True&taskId=someTask");
  });
});

describe("getPatchRoute", () => {
  it("generates a link to the version page if it is not provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: false })).toBe(
      "/version/somePatchId/tasks?"
    );
  });
  it("generates a link to the patch configure page if it is  provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toBe(
      "/patch/somePatchId/configure/tasks?"
    );
  });
  it("generates a link with a default tab when none is provided", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toBe(
      "/patch/somePatchId/configure/tasks?"
    );
  });
  it("generates a link with a provided tab", () => {
    expect(
      getPatchRoute("somePatchId", { configure: true, tab: "parameters" })
    ).toBe("/patch/somePatchId/configure/parameters?");
    expect(
      getPatchRoute("somePatchId", { configure: true, tab: "someTab" })
    ).toBe("/patch/somePatchId/configure/someTab?");
  });
});
