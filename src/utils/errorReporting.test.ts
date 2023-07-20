import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";

const { mockEnv, cleanup } = mockEnvironmentVariables();

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

  it("should log errors into console when not in production", () => {
    const err = new Error("test error");
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

  it("should report errors to Bugsnag and Sentry when in production", () => {
    mockEnv("NODE_ENV", "production");
    jest.spyOn(Bugsnag, "notify").mockImplementation(jest.fn());
    jest.spyOn(Sentry, "captureException").mockImplementation(jest.fn());

    const err = new Error("test error");
    const result = reportError(err);
    result.severe();
    expect(Bugsnag.notify).toHaveBeenCalledWith(err, expect.any(Function));
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
    result.warning();
    expect(Bugsnag.notify).toHaveBeenLastCalledWith(err, expect.any(Function));
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
  });

  it("supports metadata field", () => {
    mockEnv("NODE_ENV", "production");
    jest.spyOn(Bugsnag, "notify").mockImplementation(jest.fn());
    jest.spyOn(Sentry, "captureException").mockImplementation(jest.fn());
    const err = {
      message: "GraphQL Error",
      name: "Error Name",
    };

    const metadata = { customField: "foo" };
    const result = reportError(err, metadata);
    result.severe();
    expect(Bugsnag.notify).toHaveBeenCalledWith(err, expect.any(Function));
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
    result.warning();
    expect(Bugsnag.notify).toHaveBeenLastCalledWith(err, expect.any(Function));
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
  });
});

describe("breadcrumbs", () => {
  beforeEach(() => {
    jest.spyOn(console, "debug").mockImplementation(() => {});
    jest.spyOn(Bugsnag, "leaveBreadcrumb");
    jest.spyOn(Sentry, "addBreadcrumb");
  });
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it("should log errors into console when not in production", () => {
    const message = "my message";
    const type = "error";
    const metadata = { foo: "bar" };

    leaveBreadcrumb(message, metadata, type);
    expect(console.debug).toHaveBeenLastCalledWith({
      message,
      metadata,
      type,
    });
    expect(Bugsnag.leaveBreadcrumb).not.toHaveBeenCalled();
    expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
  });

  it("should report errors to Bugsnag and Sentry when in production and convert Sentry errors", () => {
    mockEnv("NODE_ENV", "production");
    jest.spyOn(Bugsnag, "leaveBreadcrumb").mockImplementation(jest.fn());
    jest.spyOn(Sentry, "addBreadcrumb").mockImplementation(jest.fn());

    const message = "my message";
    const type = "log";
    const metadata = { statusCode: 401 };

    leaveBreadcrumb(message, metadata, type);
    expect(Bugsnag.leaveBreadcrumb).toHaveBeenCalledWith(
      message,
      metadata,
      type
    );
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message,
      type: "info",
      data: { status_code: 401 },
    });
  });
});
