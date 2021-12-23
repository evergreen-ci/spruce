import { getLobsterTestLogCompleteUrl } from "./externalResources";

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
