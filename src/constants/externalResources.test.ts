import {
  getLobsterTestLogCompleteUrl,
  getParsleyBuildLogURL,
  getParsleyTestLogURL,
  getHoneycombTraceUrl,
  getHoneycombSystemMetricsUrl,
} from "./externalResources";

describe("getLobsterTestLogCompleteUrl", () => {
  const taskId = "taskId";
  const groupId = "groupId";
  const execution = 44;
  const lineNum = 33;
  it("generates correct URL based on function params.", () => {
    expect(
      getLobsterTestLogCompleteUrl({
        taskId,
        execution,
        groupId,
        lineNum,
      })
    ).toBe("/lobster/evergreen/complete-test/taskId/44/groupId#shareLine=33");
    expect(
      getLobsterTestLogCompleteUrl({
        taskId,
        execution,
      })
    ).toBe("/lobster/evergreen/complete-test/taskId/44");
    expect(
      getLobsterTestLogCompleteUrl({
        taskId,
        execution,
        groupId: "",
        lineNum: 0,
      })
    ).toBe("/lobster/evergreen/complete-test/taskId/44");
  });
});

describe("getParsleyTestLogURL", () => {
  it("generates the correct url", () => {
    expect(getParsleyTestLogURL("myBuildId", "myTestId")).toBe(
      "/resmoke/myBuildId/test/myTestId"
    );
  });
});

describe("getParsleyBuildLogURL", () => {
  it("generates the correct url", () => {
    expect(getParsleyBuildLogURL("myBuildId")).toBe("/resmoke/myBuildId/all");
  });
});

describe("getTaskTraceUrl", () => {
  it("generates the correct url", () => {
    expect(
      getHoneycombTraceUrl("abcdef", new Date("2023-07-07T19:08:41"))
    ).toBe(
      "https://ui.honeycomb.io/mongodb-4b/environments/staging/datasets/evergreen-agent/trace?trace_id=abcdef&trace_start_ts=1688756921"
    );
  });
});

describe("getTaskSystemMetricsUrl", () => {
  it("generates the correct url", () => {
    expect(
      getHoneycombSystemMetricsUrl(
        "task_12345",
        new Date("2023-07-07T19:08:41"),
        new Date("2023-07-07T20:00:00")
      )
    ).toBe(
      `https://ui.honeycomb.io/mongodb-4b/environments/staging/datasets/evergreen?query={"calculations":[{"op":"AVG","column":"system.memory.usage.used"},{"op":"AVG","column":"system.cpu.utilization"},{"op":"AVG","column":"system.network.io.transmit"},{"op":"AVG","column":"system.network.io.receive"}],"filters":[{"op":"=","column":"evergreen.task.id","value":"task_12345"}],"start_time":1688756921,"end_time":1688760000,"granularity":15}&omitMissingValues"`
    );
  });
});
