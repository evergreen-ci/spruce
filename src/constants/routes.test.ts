import { PatchTab } from "types/patch";
import { TaskTab } from "types/task";
import {
  getTaskRoute,
  getVersionRoute,
  getSpawnHostRoute,
  getPatchRoute,
} from "./routes";

describe("getTaskRoute", () => {
  it("Generates a test route with only an id", () => {
    expect(getTaskRoute("SomeId")).toEqual("/task/SomeId");
  });
  it("Generates a test route with only an id and a tab", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab })).toEqual(
      "/task/SomeId/logs"
    );
  });
  it("Generates a test route with only an id and some params", () => {
    expect(getTaskRoute("SomeId", { a: "b" })).toEqual("/task/SomeId?a=b");
  });
  it("Generates a test route with only an id, tab and some params", () => {
    expect(getTaskRoute("SomeId", { tab: "logs" as TaskTab, a: "b" })).toEqual(
      "/task/SomeId/logs?a=b"
    );
  });
});

describe("getVersionRoute", () => {
  it("Generates a version route with  the default tab when provided an id", () => {
    expect(getVersionRoute("SomeId")).toEqual("/version/SomeId/tasks?");
  });
  it("Generates a version route with only an id and a tab", () => {
    expect(getVersionRoute("SomeId", { tab: "tasks" as PatchTab })).toEqual(
      "/version/SomeId/tasks?"
    );
  });
  it("Generates a version route with only an id and some params", () => {
    expect(getVersionRoute("SomeId", { variant: "b" })).toEqual(
      "/version/SomeId/tasks?variant=b"
    );
  });
  it("Generates a version route with only an id, tab and some params", () => {
    expect(
      getVersionRoute("SomeId", { tab: "tasks" as PatchTab, variant: "b" })
    ).toEqual("/version/SomeId/tasks?variant=b");
  });
});

describe("getSpawnHostRoute", () => {
  it("Generates a default Spawn host route when provided with no params", () => {
    expect(getSpawnHostRoute({})).toEqual("/spawn/host?");
  });
  it("Generates a default Spawn host route with filled params when provided", () => {
    expect(
      getSpawnHostRoute({
        distroId: "ubuntu1604",
        taskId: "someTask",
        spawnHost: true,
      })
    ).toEqual("/spawn/host?distroId=ubuntu1604&spawnHost=True&taskId=someTask");
  });
});

describe("getPatchRoute", () => {
  it("Generates a link to the version page if it is not provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: false })).toEqual(
      "/version/somePatchId/tasks?"
    );
  });
  it("Generates a link to the patch configure page if it is  provided with a configurable option", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toEqual(
      "/patch/somePatchId/configure/tasks?"
    );
  });
  it("Generates a link with a default tab when none is provided", () => {
    expect(getPatchRoute("somePatchId", { configure: true })).toEqual(
      "/patch/somePatchId/configure/tasks?"
    );
  });
  it("Generates a link with a provided tab ", () => {
    expect(
      getPatchRoute("somePatchId", { configure: true, tab: "parameters" })
    ).toEqual("/patch/somePatchId/configure/parameters?");
    expect(
      getPatchRoute("somePatchId", { configure: true, tab: "someTab" })
    ).toEqual("/patch/somePatchId/configure/someTab?");
  });
});
