import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";

const { cleanup, mockEnv } = mockEnvironmentVariables();

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

  it("should log breadcrumbs into console when not in production", () => {
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

  it("should report breadcrumbs to Bugsnag and Sentry when in production and convert Sentry breadcrumbs", () => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
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
      timestamp: 1577836800,
      data: { status_code: 401 },
    });
    jest.useRealTimers();
  });

  it("warns when 'from' or 'to' fields are missing with a navigation breadcrumb", () => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    jest.spyOn(console, "warn").mockImplementation(() => {});
    mockEnv("NODE_ENV", "production");
    jest.spyOn(Bugsnag, "leaveBreadcrumb").mockImplementation(jest.fn());
    jest.spyOn(Sentry, "addBreadcrumb").mockImplementation(jest.fn());

    const message = "navigation message";
    const type = "navigation";
    const metadata = {};

    leaveBreadcrumb(message, metadata, type);
    expect(console.warn).toHaveBeenNthCalledWith(
      1,
      "Navigation breadcrumbs should include a 'from' metadata field."
    );
    expect(console.warn).toHaveBeenNthCalledWith(
      2,
      "Navigation breadcrumbs should include a 'to' metadata field."
    );
    expect(Bugsnag.leaveBreadcrumb).toHaveBeenCalledWith(
      message,
      metadata,
      type
    );
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message,
      type,
      timestamp: 1577836800,
      data: {},
    });
    jest.useRealTimers();
  });
});
