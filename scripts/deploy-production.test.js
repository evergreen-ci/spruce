import prompts from "prompts";
import { evergreenDeploy, localDeploy } from "./deploy-production";
import deployUtils from "./deploy-utils";

const createNewTagResolveValue = "createNewTagResolveValue";
const deleteTagRejectedValue = new Error("deleteTagRejectedValue");
const deleteTagResolveValue = "deleteTagResolveValue";
const getCommitMessagesResolveValue = "getCommitMessagesResolveValue";
const getLatestTagResolveValue = "getLatestTagResolveValue";
const pushTagsRejectValue = new Error("pushTagsRejectValue");
const pushTagsResolveValue = "pushTagsResolveValue";
const runLocalDeployRejectValue = "runLocalDeployRejectValue";
const runLocalDeployResolveValue = "runLocalDeployResolveValue";

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
      .mockResolvedValue(getCommitMessagesResolveValue);
    prompts.mockReturnValue({ value: true });
    jest
      .spyOn(deployUtils, "createNewTag")
      .mockResolvedValue(createNewTagResolveValue);

    await expect(evergreenDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      "Commit messages:\ngetCommitMessagesResolveValue"
    );

    expect(prompts).toHaveBeenCalledWith({
      message: "Are you sure you want to deploy to production?",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenNthCalledWith(2, createNewTagResolveValue);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      "Pushed to remote. Should be deploying soon..."
    );
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      "Track deploy progress at https://spruce.mongodb.com/commits/spruce?requester=git_tag_request"
    );
    expect(console.log).toHaveBeenCalledTimes(4);
  });

  it("terminates if user cancels when commits are found", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(true);
    jest
      .spyOn(deployUtils, "getCommitMessages")
      .mockResolvedValue(getCommitMessagesResolveValue);
    prompts.mockReturnValue({ value: false });

    await expect(evergreenDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      "Commit messages:\ngetCommitMessagesResolveValue"
    );

    expect(prompts).toHaveBeenCalledWith({
      message: "Are you sure you want to deploy to production?",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenCalledTimes(1);
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
      jest
        .spyOn(deployUtils, "getLatestTag")
        .mockResolvedValue(getLatestTagResolveValue);
      jest
        .spyOn(deployUtils, "deleteTag")
        .mockResolvedValue(deleteTagResolveValue);
      jest
        .spyOn(deployUtils, "pushTags")
        .mockResolvedValue(pushTagsResolveValue);

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
        "Deleting and re-pushing latest tag (getLatestTagResolveValue)"
      );
      expect(deployUtils.getLatestTag).toHaveBeenCalledTimes(1);
      expect(deployUtils.deleteTag).toHaveBeenCalledWith(
        getLatestTagResolveValue
      );
      expect(console.log).toHaveBeenCalledWith(deleteTagResolveValue);
      expect(deployUtils.pushTags).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledWith(pushTagsResolveValue);
      expect(console.log).toHaveBeenCalledTimes(3);
    });

    it("aborts if deleting tag fails", async () => {
      jest.spyOn(console, "error").mockImplementation();
      prompts.mockReturnValue({ value: true });
      jest
        .spyOn(deployUtils, "getLatestTag")
        .mockResolvedValue(getLatestTagResolveValue);
      jest
        .spyOn(deployUtils, "deleteTag")
        .mockRejectedValue(deleteTagRejectedValue);

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
        "Deleting and re-pushing latest tag (getLatestTagResolveValue)"
      );
      expect(deployUtils.getLatestTag).toHaveBeenCalledTimes(1);
      expect(deployUtils.deleteTag).toHaveBeenCalledWith(
        getLatestTagResolveValue
      );
      expect(console.error).toHaveBeenCalledWith(deleteTagRejectedValue);
      expect(console.error).toHaveBeenCalledWith(
        "Deleting and pushing tag failed. Aborting."
      );
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(2);
    });

    it("aborts if pushing tag fails", async () => {
      jest.spyOn(console, "error").mockImplementation();
      prompts.mockReturnValue({ value: true });
      jest
        .spyOn(deployUtils, "getLatestTag")
        .mockResolvedValue(getLatestTagResolveValue);
      jest
        .spyOn(deployUtils, "deleteTag")
        .mockResolvedValue(deleteTagResolveValue);
      jest
        .spyOn(deployUtils, "pushTags")
        .mockRejectedValue(pushTagsRejectValue);

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
        "Deleting and re-pushing latest tag (getLatestTagResolveValue)"
      );
      expect(deployUtils.getLatestTag).toHaveBeenCalledTimes(1);
      expect(deployUtils.deleteTag).toHaveBeenCalledWith(
        getLatestTagResolveValue
      );
      expect(console.log).toHaveBeenCalledWith(deleteTagResolveValue);
      expect(deployUtils.pushTags).toHaveBeenCalledWith();
      expect(console.error).toHaveBeenNthCalledWith(1, pushTagsRejectValue);
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

  it("returns when not on main branch", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(false);

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(
      "You must be on the main branch to deploy!"
    );
  });

  it("returns when on main branch with unclean working directory", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(false);

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(
      "You must have a clean working directory to deploy"
    );
  });

  it("aborts the local deploy when user declines", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(true);
    prompts.mockReturnValue({ value: false });

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(deployUtils.runLocalDeploy).not.toHaveBeenCalled();
    expect(prompts).toHaveBeenCalledWith({
      message:
        "Are you sure you'd like to build Spruce locally and push directly to S3? This is a high-risk operation that requires a correctly configured local environment.",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  it("runs the local deploy when user confirms", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(true);
    prompts.mockReturnValue({ value: true });
    jest
      .spyOn(deployUtils, "runLocalDeploy")
      .mockResolvedValue(runLocalDeployResolveValue);

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(prompts).toHaveBeenCalledWith({
      message:
        "Are you sure you'd like to build Spruce locally and push directly to S3? This is a high-risk operation that requires a correctly configured local environment.",
      name: "value",
      type: "confirm",
    });
    expect(console.log).toHaveBeenCalledWith(runLocalDeployResolveValue);
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it("displays an error if the local deploy fails", async () => {
    jest.spyOn(deployUtils, "isOnMainBranch").mockResolvedValue(true);
    jest.spyOn(deployUtils, "isWorkingDirectoryClean").mockResolvedValue(true);
    jest.spyOn(console, "error").mockImplementation();
    prompts.mockReturnValue({ value: true });
    jest
      .spyOn(deployUtils, "runLocalDeploy")
      .mockRejectedValue(runLocalDeployRejectValue);

    await expect(localDeploy()).resolves.toBeUndefined();
    expect(prompts).toHaveBeenCalledWith({
      message:
        "Are you sure you'd like to build Spruce locally and push directly to S3? This is a high-risk operation that requires a correctly configured local environment.",
      name: "value",
      type: "confirm",
    });
    expect(console.error).toHaveBeenCalledWith(runLocalDeployRejectValue);
    expect(console.error).toHaveBeenCalledWith(
      "Local deploy failed. Aborting."
    );
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
