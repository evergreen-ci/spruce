import prompts from "prompts";
import { evergreenDeploy, localDeploy, ciDeploy } from "./deploy-production";
import { runDeploy } from "./utils/deploy";
import { getCommitMessages, getCurrentlyDeployedCommit } from "./utils/git";
import { tagUtils } from "./utils/git/tag";
import { isRunningOnCI } from "./utils/environment";

jest.mock("prompts");
jest.mock("./utils/git/tag");
jest.mock("./utils/git");
jest.mock("./utils/deploy");
jest.mock("./utils/environment");

describe("deploy-production", () => {
  let consoleLogMock;
  let processExitMock;
  let consoleErrorMock;

  beforeEach(() => {
    consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
    processExitMock = jest
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("evergreenDeploy", () => {
    it("should force deploy if no new commits and user confirms", async () => {
      (getCommitMessages as jest.Mock).mockReturnValue("");
      (prompts as unknown as jest.Mock).mockResolvedValue({ value: true });

      await evergreenDeploy();

      expect(tagUtils.deleteTag).toHaveBeenCalled();
      expect(tagUtils.pushTags).toHaveBeenCalled();
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Check Evergreen for deploy progress."
      );
    });

    it("should cancel deploy if no new commits and user denies", async () => {
      (getCommitMessages as jest.Mock).mockReturnValue("");
      (prompts as unknown as jest.Mock).mockResolvedValue({ value: false });
      await evergreenDeploy();
      expect(tagUtils.deleteTag).not.toHaveBeenCalled();
      expect(tagUtils.pushTags).not.toHaveBeenCalled();
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Deploy canceled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run yarn deploy:prod --local."
      );
    });

    it("should deploy if new commits, user confirms and create tag succeeds", async () => {
      (getCommitMessages as jest.Mock).mockReturnValue(
        "getCommitMessages result"
      );
      (prompts as unknown as jest.Mock).mockResolvedValue({ value: true });
      (tagUtils.createTagAndPush as jest.Mock).mockResolvedValue(true);
      const createTagAndPushMock = jest
        .spyOn(tagUtils, "createTagAndPush")
        .mockImplementation(() => true);
      (getCurrentlyDeployedCommit as jest.Mock).mockReturnValue(
        "getCurrentlyDeployedCommit mock"
      );
      await evergreenDeploy();
      expect(consoleLogMock).toHaveBeenCalledTimes(2);
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Currently Deployed Commit: getCurrentlyDeployedCommit mock"
      );
      expect(consoleLogMock).toHaveBeenCalledWith(
        "Commit messages:\ngetCommitMessages result"
      );
      expect(createTagAndPushMock).toBeCalledTimes(1);
    });

    it("return exit code 1 if an error is thrown", async () => {
      const e = new Error("test error", { cause: "cause of test error" });
      (getCommitMessages as jest.Mock).mockReturnValue(
        "getCommitMessages result"
      );
      (prompts as unknown as jest.Mock).mockResolvedValue({ value: true });
      (tagUtils.createTagAndPush as jest.Mock).mockImplementation(() => {
        throw e;
      });
      expect(await evergreenDeploy());
      expect(consoleErrorMock).toHaveBeenCalledWith(e);
      expect(consoleLogMock).toHaveBeenCalledWith("Deploy failed.");
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe("localDeploy", () => {
    it("should run deploy when user confirms", async () => {
      (prompts as unknown as jest.Mock).mockResolvedValue({ value: true });
      await localDeploy();
      expect(runDeploy).toHaveBeenCalled();
    });

    it("should not run deploy when user denies", async () => {
      (prompts as unknown as jest.Mock).mockResolvedValue({ value: false });
      await localDeploy();
      expect(runDeploy).not.toHaveBeenCalled();
    });

    it("logs and error and returns exit code 1 when error is thrown", async () => {
      (prompts as unknown as jest.Mock).mockResolvedValue({ value: true });
      const e = new Error("error mock");
      (runDeploy as jest.Mock).mockImplementation(() => {
        throw e;
      });
      await localDeploy();
      expect(consoleErrorMock).toHaveBeenCalledWith(e);
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Local deploy failed. Aborting."
      );
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe("ciDeploy", () => {
    it("returns exit code 1 when not running in CI", async () => {
      (isRunningOnCI as jest.Mock).mockReturnValue(false);
      await ciDeploy();
      expect(consoleErrorMock).toHaveBeenCalledWith(
        new Error("Not running on CI")
      );
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "CI deploy failed. Aborting."
      );
      expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it("should run deploy when running on CI", async () => {
      (isRunningOnCI as jest.Mock).mockReturnValue(true);
      await ciDeploy();
      expect(runDeploy).toHaveBeenCalled();
    });
  });
});
