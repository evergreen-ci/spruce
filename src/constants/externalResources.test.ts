import { getLobsterTestLogUrl, isLobsterLink } from "./externalResources";

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

describe("isLobsterLink", () => {
  it("Detects whether a supplied string could be a link to lobster", () => {
    expect(isLobsterLink("")).toEqual(false);
    expect(
      isLobsterLink("https://logkeeper.mongodb.org/build/artarstrast")
    ).toEqual(true);
    expect(isLobsterLink("https://blah.com/build/arst/sart/")).toEqual(true);
    expect(isLobsterLink("rsatrast//blah.com/lobster/arst/build")).toEqual(
      false
    );
    expect(isLobsterLink("blah.com/lobster/arst/sart")).toEqual(false);
  });
});
