import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import * as Sentry from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { initializeErrorHandling } from ".";

const { cleanup, mockEnv } = mockEnvironmentVariables();

describe("should initialize error handlers according to release stage", () => {
  beforeEach(() => {
    jest.spyOn(Bugsnag, "start").mockImplementation(jest.fn());
    jest.spyOn(Bugsnag, "isStarted").mockImplementation(jest.fn(() => false));
    jest.spyOn(Sentry, "init").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it("development", () => {
    mockEnv("NODE_ENV", "development");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    initializeErrorHandling();

    expect(Bugsnag.start).not.toHaveBeenCalled();
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("production", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    mockEnv("REACT_APP_BUGSNAG_API_KEY", "i-am-a-fake-key");
    mockEnv("REACT_APP_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Bugsnag.start).toHaveBeenCalledWith({
      apiKey: "i-am-a-fake-key",
      appVersion: "1.0.0",
      releaseStage: "production",
      plugins: [new BugsnagPluginReact()],
    });

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: "fake-sentry-key",
      debug: false,
      release: APP_VERSION,
      environment: "production",
    });
  });

  it("beta", () => {
    mockEnv("REACT_APP_RELEASE_STAGE", "beta");
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_BUGSNAG_API_KEY", "i-am-a-fake-key");
    mockEnv("REACT_APP_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Bugsnag.start).toHaveBeenCalledWith({
      apiKey: "i-am-a-fake-key",
      appVersion: "1.0.0",
      releaseStage: "beta",
      plugins: [new BugsnagPluginReact()],
    });

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: "fake-sentry-key",
      debug: true,
      release: APP_VERSION,
      environment: "beta",
    });
  });

  it("staging", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_RELEASE_STAGE", "staging");
    mockEnv("REACT_APP_BUGSNAG_API_KEY", "i-am-a-fake-key");
    mockEnv("REACT_APP_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Bugsnag.start).toHaveBeenCalledWith({
      apiKey: "i-am-a-fake-key",
      appVersion: "1.0.0",
      releaseStage: "staging",
      plugins: [new BugsnagPluginReact()],
    });

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: "fake-sentry-key",
      debug: true,
      release: APP_VERSION,
      environment: "staging",
    });
  });
});

describe("should not initialize if the client is already running", () => {
  beforeEach(() => {
    jest.spyOn(Bugsnag, "start").mockImplementation(jest.fn());
    jest.spyOn(Bugsnag, "isStarted").mockImplementation(jest.fn(() => false));
    jest.spyOn(Sentry, "init").mockImplementation(jest.fn());
    mockEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it("does not initialize Bugsnag twice", () => {
    jest.spyOn(Bugsnag, "isStarted").mockImplementation(jest.fn(() => true));
    initializeErrorHandling();
    expect(Bugsnag.start).not.toHaveBeenCalled();
    expect(Sentry.init).toHaveBeenCalledTimes(1);
  });

  it("does not initialize Sentry twice", () => {
    // @ts-expect-error
    // eslint-disable-next-line no-underscore-dangle
    window.__SENTRY__ = {
      hub: { getClient: () => true },
    };
    initializeErrorHandling();
    expect(Bugsnag.start).toHaveBeenCalledTimes(1);
    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
