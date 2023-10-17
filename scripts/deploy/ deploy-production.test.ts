import prompts from "prompts";
import { evergreenDeploy, localDeploy, ciDeploy } from "./deploy-production";
import { runDeploy } from "./utils/deploy";
import { getCommitMessages } from "./utils/git";
import { tagUtils } from "./utils/git/tag";
import { isRunningOnCI } from "./utils/environment";

jest.mock("prompts");
jest.mock("./utils/git/tag");
jest.mock("./utils/git");
jest.mock("./utils/deploy");
jest.mock("./utils/environment");

describe("deploy-production", () => {
  let consoleLogMock;
  let consoleExitMock;
  let errorMock;

  beforeEach(() => {
    consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    errorMock = jest.spyOn(console, "error").mockImplementation();
    consoleExitMock = jest
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
      (tagUtils.createNewTag as jest.Mock).mockResolvedValue(true);
      await evergreenDeploy();
      expect(consoleLogMock).toHaveBeenCalledTimes(4);
    });

    it("return exit code 1 if an error is thrown", async () => {
      (getCommitMessages as jest.Mock).mockReturnValue(new Error("error mock"));
      await evergreenDeploy();
      expect(consoleLogMock).toHaveBeenCalledWith("Deploy failed.");
      expect(consoleExitMock).toHaveBeenCalledWith(1);
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
      (runDeploy as jest.Mock).mockImplementation(() => {
        throw new Error("error mock");
      });
      await localDeploy();
      expect(errorMock).toHaveBeenCalledWith(new Error("error mock"));
      expect(errorMock).toHaveBeenCalledWith("Local deploy failed. Aborting.");
      expect(consoleExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe("ciDeploy", () => {
    it("returns exit code 1 when not running in CI", async () => {
      (isRunningOnCI as jest.Mock).mockReturnValue(false);
      await ciDeploy();
      expect(errorMock).toHaveBeenCalledWith(new Error("Not running on CI"));
      expect(errorMock).toHaveBeenCalledWith("CI deploy failed. Aborting.");
      expect(consoleExitMock).toHaveBeenCalledWith(1);
    });

    it("should run deploy when running on CI", async () => {
      (isRunningOnCI as jest.Mock).mockReturnValue(true);
      await ciDeploy();
      expect(runDeploy).toHaveBeenCalled();
    });
  });
});
