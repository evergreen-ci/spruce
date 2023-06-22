import prompts from "prompts";
import { evergreenDeploy } from "./deploy-production";
import deployUtils from "./deploy-utils";

jest.mock("./deploy-utils");
jest.mock("prompts");

describe("deploy script", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns when not on main branch", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(false);

    await expect(evergreenDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(
      "You must be on the main branch to deploy!"
    );
  });

  it("returns when on main branch with unclean working directory", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(false);

    await expect(evergreenDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(
      "You must have a clean working directory to deploy"
    );
  });

  it("pushes new commits when they exist", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(true);
    jest
      .spyOn(deployUtils, "getCommitMessages")
      .mockResolvedValue("new commit messages");
    prompts.mockReturnValue({ value: true });
    jest
      .spyOn(deployUtils, "createNewTag")
      .mockResolvedValue("<yarn version goes here>");

    await expect(evergreenDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenNthCalledWith(1, "Commit messages:");
    expect(console.log).toHaveBeenNthCalledWith(2, "new commit messages");

    expect(prompts).toHaveBeenCalledWith({
      message: "Are you sure you want to deploy to production?",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenNthCalledWith(3, "<yarn version goes here>");
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      "Pushed to remote. Should be deploying soon..."
    );
    expect(console.log).toHaveBeenNthCalledWith(
      5,
      "Track deploy progress at https://spruce.mongodb.com/commits/spruce?requester=git_tag_request"
    );
    expect(console.log).toHaveBeenCalledTimes(5);
  });

  it("terminates if user cancels when commits are found", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(true);
    jest
      .spyOn(deployUtils, "getCommitMessages")
      .mockResolvedValue("new commit messages");
    prompts.mockReturnValue({ value: false });
    jest
      .spyOn(deployUtils, "createNewTag")
      .mockResolvedValue("<yarn version goes here>");

    await expect(evergreenDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenNthCalledWith(1, "Commit messages:");
    expect(console.log).toHaveBeenNthCalledWith(2, "new commit messages");

    expect(prompts).toHaveBeenCalledWith({
      message: "Are you sure you want to deploy to production?",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  describe("when no commits are found", () => {
    beforeEach(() => {
      // Mock that these tests are run on main branch, in clean working directory, with 0 commits
      jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
      jest
        .spyOn(deployUtils, "isWorkingDirectoryClean")
        .mockResolvedValue(true);
      jest.spyOn(deployUtils, "getCommitMessages").mockResolvedValue("");
    });

    it("terminates if user cancels when no commits are found", async () => {
      prompts.mockReturnValue({ value: false });

      await expect(evergreenDeploy()).resolves.toBeUndefined();
      expect(deployUtils.getCommitMessages).toHaveBeenCalledWith();
      expect(prompts).toHaveBeenCalledWith({
        initial: false,
        message: "No new commits. Do you want to deploy anyway?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deploy canceled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run yarn deploy:prod --local."
      );
    });

    it("deletes and pushes tag if no commits found", async () => {
      prompts.mockReturnValue({ value: true });
      jest.spyOn(deployUtils, "getLatestTag").mockResolvedValue("v0.0.0");
      jest
        .spyOn(deployUtils, "deleteTag")
        .mockResolvedValue("git push --delete remote v0.0.0");
      jest
        .spyOn(deployUtils, "pushTags")
        .mockResolvedValue("git push --tags remote");

      await expect(evergreenDeploy()).resolves.toBeUndefined();
      expect(deployUtils.getCommitMessages).toHaveBeenCalledWith();
      expect(prompts).toHaveBeenCalledWith({
        initial: false,
        message: "No new commits. Do you want to deploy anyway?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deleting and re-pushing latest tag (v0.0.0)"
      );
      expect(deployUtils.deleteTag).toHaveBeenCalledWith("v0.0.0");
      expect(console.log).toHaveBeenCalledWith(
        "git push --delete remote v0.0.0"
      );
      expect(deployUtils.pushTags).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledWith("git push --tags remote");
      expect(console.log).toHaveBeenCalledTimes(3);
    });

    it("aborts if deleting tag fails", async () => {
      jest.spyOn(console, "error").mockImplementation();
      prompts.mockReturnValue({ value: true });
      jest.spyOn(deployUtils, "getLatestTag").mockResolvedValue("v0.0.0");
      jest
        .spyOn(deployUtils, "deleteTag")
        .mockRejectedValue(new Error("GitHub could not be reached"));

      await expect(evergreenDeploy()).resolves.toBeUndefined();
      expect(deployUtils.getCommitMessages).toHaveBeenCalledWith();
      expect(prompts).toHaveBeenCalledWith({
        initial: false,
        message: "No new commits. Do you want to deploy anyway?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deleting and re-pushing latest tag (v0.0.0)"
      );
      expect(deployUtils.deleteTag).toHaveBeenCalledWith("v0.0.0");
      expect(console.error).toHaveBeenCalledWith(
        new Error("GitHub could not be reached")
      );
      expect(console.error).toHaveBeenCalledWith(
        "Deleting and pushing tag failed. Aborting."
      );
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(2);
    });

    it("aborts if pushing tag fails", async () => {
      jest.spyOn(console, "error").mockImplementation();
      prompts.mockReturnValue({ value: true });
      jest.spyOn(deployUtils, "getLatestTag").mockResolvedValue("v0.0.0");
      jest
        .spyOn(deployUtils, "deleteTag")
        .mockResolvedValue("git push --delete remote v0.0.0");
      jest
        .spyOn(deployUtils, "pushTags")
        .mockRejectedValue(new Error("Conflict pushing tags"));

      await expect(evergreenDeploy()).resolves.toBeUndefined();
      expect(deployUtils.getCommitMessages).toHaveBeenCalledWith();
      expect(prompts).toHaveBeenCalledWith({
        initial: false,
        message: "No new commits. Do you want to deploy anyway?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deleting and re-pushing latest tag (v0.0.0)"
      );
      expect(deployUtils.deleteTag).toHaveBeenCalledWith("v0.0.0");
      expect(console.log).toHaveBeenCalledWith(
        "git push --delete remote v0.0.0"
      );
      expect(deployUtils.pushTags).toHaveBeenCalledWith();
      expect(console.error).toHaveBeenNthCalledWith(
        1,
        new Error("Conflict pushing tags")
      );
      expect(console.error).toHaveBeenNthCalledWith(
        2,
        "Deleting and pushing tag failed. Aborting."
      );
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledTimes(2);
    });
  });
});
