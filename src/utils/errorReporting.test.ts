import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { errorReporting } from "utils";

const { reportError } = errorReporting;

const { mockEnv, cleanup } = mockEnvironmentVariables();
const err = new Error("test error");

describe("error reporting", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Bugsnag, "notify");
    jest.spyOn(Sentry, "captureException");
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
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("should report errors to bugsnag when in production", () => {
    mockEnv("NODE_ENV", "production");
    jest.spyOn(Bugsnag, "notify").mockImplementation(jest.fn());
    jest.spyOn(Sentry, "captureException").mockImplementation(jest.fn());

    const result = reportError(err);
    result.severe();
    expect(Bugsnag.notify).toHaveBeenCalledWith(err, expect.any(Function));
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
    result.warning();
    expect(Bugsnag.notify).toHaveBeenLastCalledWith(err, expect.any(Function));
  });
});
