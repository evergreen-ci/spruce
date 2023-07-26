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
        execution,
        groupId,
        lineNum,
        taskId,
      })
    ).toBe("/lobster/evergreen/complete-test/taskId/44/groupId#shareLine=33");
    expect(
      getLobsterTestLogCompleteUrl({
        execution,
        taskId,
      })
    ).toBe("/lobster/evergreen/complete-test/taskId/44");
    expect(
      getLobsterTestLogCompleteUrl({
        execution,
        groupId: "",
        lineNum: 0,
        taskId,
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
      "/datasets/evergreen-agent/trace?trace_id=abcdef&trace_start_ts=1688756921"
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
      '/datasets/evergreen?query={"calculations":[{"column":"system.memory.usage.used","op":"AVG"},{"column":"system.cpu.utilization","op":"AVG"},{"column":"system.network.io.transmit","op":"RATE_AVG"},{"column":"system.network.io.receive","op":"RATE_AVG"}],"end_time":1688760000,"filters":[{"column":"evergreen.task.id","op":"=","value":"task_12345"}],"start_time":1688756921}&omitMissingValues'
    );
  });
});
