import prompts from "prompts";
import { evergreenDeploy, localDeploy } from "./deploy-production";
import deployUtils from "./deploy-utils";

jest.mock("./deploy-utils");
jest.mock("prompts");

describe("evergreen deploy", () => {
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

    await expect(evergreenDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenNthCalledWith(1, "Commit messages:");
    expect(console.log).toHaveBeenNthCalledWith(2, "new commit messages");

    expect(prompts).toHaveBeenCalledWith({
      message: "Are you sure you want to deploy to production?",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(deployUtils.createNewTag).not.toHaveBeenCalled();
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
        message:
          "No new commits. Do you want to deploy the most recent existing tag?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deploy canceled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run yarn deploy:prod --local."
      );
      expect(deployUtils.getLatestTag).not.toHaveBeenCalled();
      expect(deployUtils.deleteTag).not.toHaveBeenCalled();
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
        message:
          "No new commits. Do you want to deploy the most recent existing tag?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deleting and re-pushing latest tag (v0.0.0)"
      );
      expect(deployUtils.getLatestTag).toHaveBeenCalledTimes(1);
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
        message:
          "No new commits. Do you want to deploy the most recent existing tag?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deleting and re-pushing latest tag (v0.0.0)"
      );
      expect(deployUtils.getLatestTag).toHaveBeenCalledTimes(1);
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
        message:
          "No new commits. Do you want to deploy the most recent existing tag?",
        name: "value",
        type: "confirm",
      });
      expect(console.log).toHaveBeenCalledWith(
        "Deleting and re-pushing latest tag (v0.0.0)"
      );
      expect(deployUtils.getLatestTag).toHaveBeenCalledTimes(1);
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

describe("local deploy", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("aborts the local deploy when user declines", async () => {
    prompts.mockReturnValue({ value: false });

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(deployUtils.runLocalDeploy).not.toHaveBeenCalled();
    expect(prompts).toHaveBeenCalledWith({
      message:
        "Are you sure you'd like to build Spruce locally and push directly to S3?",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  it("runs the local deploy when user confirms", async () => {
    prompts.mockReturnValue({ value: true });
    jest
      .spyOn(deployUtils, "runLocalDeploy")
      .mockResolvedValue("yarn command to build locally and push to S3");

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(prompts).toHaveBeenCalledWith({
      message:
        "Are you sure you'd like to build Spruce locally and push directly to S3?",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenCalledWith(
      "yarn command to build locally and push to S3"
    );
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it("displays an error if the local deploy fails", async () => {
    jest.spyOn(console, "error").mockImplementation();
    prompts.mockReturnValue({ value: true });
    jest
      .spyOn(deployUtils, "runLocalDeploy")
      .mockRejectedValue("yarn failed local build");

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(prompts).toHaveBeenCalledWith({
      message:
        "Are you sure you'd like to build Spruce locally and push directly to S3?",
      name: "value",
      type: "confirm",
    });
    expect(console.error).toHaveBeenCalledWith("yarn failed local build");
    expect(console.error).toHaveBeenCalledWith(
      "Local deploy failed. Aborting."
    );
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
