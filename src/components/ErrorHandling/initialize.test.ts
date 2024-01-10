import * as Sentry from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { initializeErrorHandling } from ".";

const { cleanup, mockEnv } = mockEnvironmentVariables();

describe("should initialize error handlers according to release stage", () => {
  beforeEach(() => {
    jest.spyOn(Sentry, "init").mockImplementation(jest.fn());
    jest
      .spyOn(Sentry, "Replay")
      .mockImplementation(() => ({}) as Sentry.Replay);
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

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("production", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    mockEnv("REACT_APP_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: "fake-sentry-key",
      debug: false,
      normalizeDepth: 5,
      environment: "production",
      integrations: [{}],
      replaysOnErrorSampleRate: 0.6,
      replaysSessionSampleRate: 0,
    });
  });

  it("beta", () => {
    mockEnv("REACT_APP_RELEASE_STAGE", "beta");
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: "fake-sentry-key",
      debug: true,
      normalizeDepth: 5,
      environment: "beta",
      integrations: [{}],
      replaysOnErrorSampleRate: 1,
      replaysSessionSampleRate: 0,
    });
  });

  it("staging", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_RELEASE_STAGE", "staging");
    mockEnv("REACT_APP_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: "fake-sentry-key",
      debug: true,
      normalizeDepth: 5,
      environment: "staging",
      integrations: [{}],
      replaysOnErrorSampleRate: 1,
      replaysSessionSampleRate: 0,
    });
  });
});

describe("should not initialize if the client is already running", () => {
  beforeEach(() => {
    jest.spyOn(Sentry, "init").mockImplementation(jest.fn());
    mockEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it("does not initialize Sentry twice", () => {
    const mockClient = { getClient: jest.fn(() => true) };
    // @ts-expect-error - Type error occurs because the entire return value of getCurrentHub is not mocked
    jest.spyOn(Sentry, "getCurrentHub").mockReturnValue(mockClient);
    initializeErrorHandling();
    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
