import {
  getLobsterTestLogUrl,
  getLobsterTestLogCompleteUrl,
} from "./externalResources";

describe("getLobsterTestLogUrl", () => {
  it("Generates correct URL based on function params.", () => {
    const path = "/lobster/evergreen/test/taskId/44/testId";
    const taskId = "taskId";
    const testId = "testId";
    const execution = 44;
    expect(
      getLobsterTestLogUrl({
        taskId,
        execution,
        testId,
        lineNum: 0,
        groupId: "",
      })
    ).toEqual(path);
    expect(
      getLobsterTestLogUrl({ taskId, execution, testId, groupId: "" })
    ).toEqual(path);
    expect(
      getLobsterTestLogUrl({
        taskId,
        execution,
        testId,
        lineNum: 10,
        groupId: "",
      })
    ).toEqual(`${path}#shareLine=10`);
    expect(
      getLobsterTestLogUrl({
        taskId,
        execution,
        testId,
        lineNum: 10,
        groupId: "",
      })
    ).toEqual(`/lobster/evergreen/test/taskId/44/testId#shareLine=10`);
    expect(
      getLobsterTestLogUrl({ taskId, execution, testId, groupId: "" })
    ).toEqual(`/lobster/evergreen/test/taskId/44/testId`);
    expect(
      getLobsterTestLogUrl({ taskId, execution, testId, groupId: "group" })
    ).toEqual(`/lobster/evergreen/test/taskId/44/testId/group`);
  });
});

describe("getLobsterTestLogCompleteUrl", () => {
  const taskId = "taskId";
  const groupId = "groupId";
  const execution = 44;
  const lineNum = 33;
  it("Generates correct URL based on function params.", () => {
    expect(
      getLobsterTestLogCompleteUrl({
        taskId,
        execution,
        groupId,
        lineNum,
      })
    ).toEqual(
      "/lobster/evergreen/complete-test/taskId/44/groupId#shareLine=33"
    );
    expect(
      getLobsterTestLogCompleteUrl({
        taskId,
        execution,
      })
    ).toEqual("/lobster/evergreen/complete-test/taskId/44");
    expect(
      getLobsterTestLogCompleteUrl({
        taskId,
        execution,
        groupId: "",
        lineNum: 0,
      })
    ).toEqual("/lobster/evergreen/complete-test/taskId/44");
  });
});
