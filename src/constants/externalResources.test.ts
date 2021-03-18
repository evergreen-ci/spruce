import { getLobsterTestLogUrl, isLobsterLink } from "./externalResources";

describe("getLobsterTestLogUrl", () => {
  it("Generates correct URL based on function params.", () => {
    const path = "/lobster/evergreen/test/taskId/44/testId/groupId";
    expect(
      getLobsterTestLogUrl("taskId", 44, "testId", "groupId", "0")
    ).toEqual(path);
    expect(getLobsterTestLogUrl("taskId", 44, "testId", "groupId")).toEqual(
      path
    );
    expect(
      getLobsterTestLogUrl("taskId", 44, "testId", "groupId", "10")
    ).toEqual(`${path}#bookmarks=10`);
  });
});

describe("isLobsterLink", () => {
  it("Detects whether a supplied string could be a link to lobster", () => {
    expect(isLobsterLink("")).toEqual(false);
    expect(isLobsterLink("https://blah.com/lobster")).toEqual(true);
    expect(isLobsterLink("https://blah.com/lobster/arst/sart")).toEqual(true);
    expect(isLobsterLink("rsatrast//blah.com/lobster/arst/sart")).toEqual(true);
    expect(isLobsterLink("blah.com/lobster/arst/sart")).toEqual(false);
  });
});
