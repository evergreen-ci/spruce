import { getCurrentlyDeployedCommit } from ".";

const currentlyDeployedCommitRegex = /^[0-9a-f]{40}$/;

describe("getCurrentlyDeployedCommit", () => {
  it("should return the currently deployed commit", () => {
    const currentlyDeployedCommit = getCurrentlyDeployedCommit();
    const currentlyDeployedCommitIsHash = currentlyDeployedCommitRegex.test(
      currentlyDeployedCommit
    );
    expect(currentlyDeployedCommitIsHash).toBeTruthy();
  });
});
