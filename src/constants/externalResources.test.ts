import { getLobsterTestLogUrl } from "./externalResources";

describe("getLobsterTestLogUrl", () => {
  it("Generates correct URL based on function params.", () => {
    const path = "/lobster/evergreen/test/taskId/44/testId";
    expect(getLobsterTestLogUrl("taskId", 44, "testId", 0)).toEqual(path);
    expect(getLobsterTestLogUrl("taskId", 44, "testId")).toEqual(path);
    expect(getLobsterTestLogUrl("taskId", 44, "testId", 10)).toEqual(
      `${path}#shareLine=10`
    );
    expect(getLobsterTestLogUrl("taskId", 44, "testId", 10)).toEqual(
      `/lobster/evergreen/test/taskId/44/testId#shareLine=10`
    );
    expect(getLobsterTestLogUrl("taskId", 44, "testId")).toEqual(
      `/lobster/evergreen/test/taskId/44/testId`
    );
  });
});
