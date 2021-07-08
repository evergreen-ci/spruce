import { getLobsterTestLogUrl } from "./externalResources";

describe("getLobsterTestLogUrl", () => {
  it("Generates correct URL based on function params.", () => {
    const path = "/lobster/evergreen/test/taskId/44/testId";
    const taskId = "taskId";
    const testId = "testId";
    const execution = 44;
    expect(
      getLobsterTestLogUrl({ taskId, execution, testId, lineNum: 0 })
    ).toEqual(path);
    expect(getLobsterTestLogUrl({ taskId, execution, testId })).toEqual(path);
    expect(
      getLobsterTestLogUrl({ taskId, execution, testId, lineNum: 10 })
    ).toEqual(`${path}#shareLine=10`);
    expect(
      getLobsterTestLogUrl({ taskId, execution, testId, lineNum: 10 })
    ).toEqual(`/lobster/evergreen/test/taskId/44/testId#shareLine=10`);
    expect(getLobsterTestLogUrl({ taskId, execution, testId })).toEqual(
      `/lobster/evergreen/test/taskId/44/testId`
    );
  });
});
