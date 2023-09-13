import fs from "fs";
import { checkSchemaAndCodegenCore } from ".";
import {
  canResolveDNS,
  checkIsAncestor,
  getLatestCommitFromRemote,
} from "./utils";

jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue(Buffer.from("file-contents")),
}));
jest.mock("path", () => ({
  resolve: jest.fn().mockReturnValue("{path.resolve()}"),
}));
jest.mock("./utils.ts", () => ({
  canResolveDNS: jest.fn(),
  getLatestCommitFromRemote: jest.fn(),
  checkIsAncestor: jest.fn(),
  generateTypes: jest.fn(),
}));

describe("checkSchemaAndCodegen", () => {
  let consoleInfoSpy;
  let consoleErrorSpy;
  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (canResolveDNS as jest.Mock).mockResolvedValue(true);
    (checkIsAncestor as jest.Mock).mockResolvedValue(true);
    (getLatestCommitFromRemote as jest.Mock).mockResolvedValue(
      "{getLatestCommitFromRemote()}"
    );
  });

  it("returns 0 when offline", async () => {
    (canResolveDNS as jest.Mock).mockResolvedValue(false);
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(0);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Skipping GQL codegen validation because I can't connect to github.com."
    );
  });

  it("returns 1 when checkIsAncestor is false and the files are the same", async () => {
    (checkIsAncestor as jest.Mock).mockResolvedValue(false);
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GQL types validation failed: Your local Evergreen code is missing commit {getLatestCommitFromRemote()}. Pull Evergreen and run 'yarn codegen'."
    );
  });

  it("returns 1 when checkIsAncestor is false and the files are different", async () => {
    (checkIsAncestor as jest.Mock).mockResolvedValue(false);
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(Buffer.from("content1"))
      .mockReturnValueOnce(Buffer.from("content2"));
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GQL types validation failed: Your local Evergreen code is missing commit {getLatestCommitFromRemote()}. Pull Evergreen and run 'yarn codegen'."
    );
  });

  it("returns 0 when checkIsAncestor is true and the files are the same", async () => {
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(0);
  });

  it("returns 1 when checkIsAncestor returns true and the files are different", async () => {
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(Buffer.from("content1"))
      .mockReturnValueOnce(Buffer.from("content2"));
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "GQL types validation failed: Your GQL types file ({path.resolve()}) is outdated. Run 'yarn codegen'."
    );
  });

  it("handle error and exit with 0", async () => {
    (canResolveDNS as jest.Mock).mockRejectedValue(new Error("Test Error"));
    await expect(checkSchemaAndCodegenCore()).resolves.toBe(0);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "An error occured during GQL types validation: Error: Test Error"
    );
  });
});
