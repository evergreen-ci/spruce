import { getLatestTag } from "./tag-utils";

const currentlyDeployedTagRegex = /.*\d+\.\d+\.\d+$/;

describe("getLatestTag", () => {
  it("should return the latest tag", () => {
    const latestTag = getLatestTag();
    const latestTagIsTag = currentlyDeployedTagRegex.test(latestTag);
    expect(latestTagIsTag).toBeTruthy();
  });
});
