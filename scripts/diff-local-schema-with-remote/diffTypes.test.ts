import { diffTypes } from "./diffTypes";
import fs from "fs";
import process from "process";
import { canResolveDNS, checkIsAncestor } from "./utils";

jest.mock("fs", () => ({
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue(Buffer.from("file-contents")),
}));
jest.mock("path");
jest.mock("./utils.ts", () => ({
  canResolveDNS: jest.fn().mockResolvedValue(true),
  getRemoteLatestCommitSha: jest.fn().mockResolvedValue("mocked-sha"),
  checkIsAncestor: jest.fn().mockResolvedValue(true),
  downloadAndSaveFile: jest.fn().mockResolvedValue(undefined),
  fetchFiles: jest.fn().mockResolvedValue(undefined),
  downloadAndGenerate: jest.fn().mockResolvedValue("mocked-path/types.ts"),
}));

describe("diffTypes", () => {
  let exitSpy;
  let consoleInfoSpy;
  let consoleErrorSpy;
  beforeEach(() => {
    exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("exit with 0 when internet is unavailable", async () => {
    (canResolveDNS as jest.Mock).mockResolvedValue(false);

    await diffTypes();

    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Skipping GQL codegen validation because I can't connect to github.com."
    );
  });

  it("exit with 1 when one of the generated types files does not exist", async () => {
    (fs.existsSync as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    await diffTypes();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Types file located at undefined does not exist. Validation failed."
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("exit with 1 when types files are different and checkIsAncestor is false", async () => {
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(Buffer.from("content1"))
      .mockReturnValueOnce(Buffer.from("content2"));
    (checkIsAncestor as jest.Mock).mockResolvedValue(false);

    await diffTypes();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "You are developing against an outdated schema and the codegen task will fail in CI. Run 'yarn codegen' against the latest Evergreen code."
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("exit with 0 when types files are different and checkIsAncestor is true", async () => {
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(Buffer.from("content1"))
      .mockReturnValueOnce(Buffer.from("content2"));
    (checkIsAncestor as jest.Mock).mockResolvedValue(true);

    await diffTypes();

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("exit with 1 when types files are the same and checkIsAncestor is false", async () => {
    (checkIsAncestor as jest.Mock).mockResolvedValue(false);
    await diffTypes();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("exit with 1 when types files are the same and checkIsAncestor is true", async () => {
    await diffTypes();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("handle error and exit with 1", async () => {
    (canResolveDNS as jest.Mock).mockRejectedValue(new Error("Test Error"));

    await diffTypes();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "An issue occurred validating the generated GQL types file: Error: Test Error"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
