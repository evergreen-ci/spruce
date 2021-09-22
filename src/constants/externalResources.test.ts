import { getLobsterTestLogCompleteUrl } from "./externalResources";

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
