import { getCurrentlyDeployedCommit } from "./deploy-utils";
import { getLatestTag } from "./tag-utils";

const currentlyDeployedCommitRegex = /^[0-9a-f]{40}$/;
const currentlyDeployedTagRegex = /^v\d+\.\d+\.\d+$/;

describe("getCurrentlyDeployedCommit", () => {
  it("should return the currently deployed commit", () => {
    const currentlyDeployedCommit = getCurrentlyDeployedCommit();
    const currentlyDeployedCommitIsHash = currentlyDeployedCommitRegex.test(
      currentlyDeployedCommit
    );
    expect(currentlyDeployedCommitIsHash).toBeTruthy();
  });
});

describe("getLatestTag", () => {
  it("should return the latest tag", () => {
    const latestTag = getLatestTag();
    const latestTagIsTag = currentlyDeployedTagRegex.test(latestTag);
    expect(latestTagIsTag).toBeTruthy();
  });
});
