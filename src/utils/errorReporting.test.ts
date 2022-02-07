import Bugsnag from "@bugsnag/js";
import { mockEnvironmentalVariables } from "test_utils/utils";
import { errorReporting } from "utils";

const { reportError } = errorReporting;

const { mockEnv, cleanup } = mockEnvironmentalVariables();
const err = new Error("test error");

describe("error reporting", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Bugsnag, "notify");
  });
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it("should log errors into console instead of to bugsnag when not in production", () => {
    const result = reportError(err);
    result.severe();
    expect(console.error).toHaveBeenCalledWith({
      err,
      severity: "severe",
    });
    result.warning();
    expect(console.error).toHaveBeenLastCalledWith({
      err,
      severity: "warning",
    });
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });

  it("should report errors to bugsnag when in production", () => {
    mockEnv("NODE_ENV", "production");
    const bugsnagMock = jest.fn();
    jest.spyOn(Bugsnag, "notify").mockImplementation(bugsnagMock);
    const result = reportError(err);
    result.severe();
    expect(bugsnagMock).toHaveBeenCalledWith(err, expect.any(Function));
    result.warning();
    expect(bugsnagMock).toHaveBeenLastCalledWith(err, expect.any(Function));
  });
});
